import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useThrottleFn } from "@vueuse/core";
import useGameState from "./composables/useGameState";
import useHardMode from "./composables/useHardMode";
import { useGameMode } from "@/composables/useGameMode";
import { useSpellchecker } from "@/composables/useSpellchecker";
import { MAX_GUESSES } from "@/configuration/magic-numbers";
import { evalGameStatus, hasGameEnded } from "./helpers/game-status";
import { generateWordle } from "@/helpers/wordle";
import { validateRow } from "./helpers/validation";
import { GameMessageType } from "@/models/enums/GameMessageType";
import { GameMode } from "@/models/enums/GameMode";
import GameStatus from "@/models/enums/GameStatus";
import { useMessageStore } from "@/stores/message";
import { useStatisticsStore } from "@/stores/statistics";

const usePrivateWordleStore = defineStore("privateWordle", {
	state: () => ({
		gameStatus: GameStatus.NOT_STARTED,
	}),
});

export const useWordleStore = defineStore("wordle", () => {
	const messageStore = useMessageStore();
	const statisticsStore = useStatisticsStore();
	const { gameState, resetProgress, persistGuess, initializeState } =
		useGameState();
	const { isMisspelled } = useSpellchecker();
	const gameMode = useGameMode();

	// ----- State -----
	const privateState = usePrivateWordleStore();
	const winningRowIndex = ref<number | null>(null);
	const restoredRows = ref(0);

	// ----- Getters -----
	const gameStatus = computed(() => privateState.gameStatus);
	const solution = computed(() => gameState.value.solution);
	const guesses = computed(() => gameState.value.guesses);
	const results = computed(() => gameState.value.results);
	const activeRowIndex = computed(() => guesses.value.length);
	const hasGameStarted = computed(() => activeRowIndex.value > 0);
	const isGameOver = computed(() => hasGameEnded(gameStatus.value));
	const isHardModeEnabled = useHardMode(hasGameStarted);

	// ----- Methods -----
	function validateGuess(guess: string): boolean {
		if (solution.value.length !== guess.length) {
			return false;
		} else if (solution.value === guess) {
			return true;
		}

		if (isMisspelled(guess)) {
			messageStore.setMessage(
				GameMessageType.WARNING,
				"This word is not valid!",
			);
			return false;
		}

		if (guesses.value.includes(guess)) {
			messageStore.setMessage(
				GameMessageType.WARNING,
				"This word has already been used!",
			);
			return false;
		}

		return true;
	}

	const submitWord = useThrottleFn((currGuess: string): boolean => {
		if (!validateGuess(currGuess)) return false;

		const currRow = activeRowIndex.value;
		if (currRow >= MAX_GUESSES) return false;

		const result = validateRow(solution.value, currGuess);
		persistGuess(result, currGuess, currRow);

		const newGameStatus = evalGameStatus(
			solution.value,
			guesses.value,
			activeRowIndex.value,
		);

		if (hasGameEnded(newGameStatus)) {
			statisticsStore.saveGameResults(newGameStatus, currRow + 1);

			if (newGameStatus === GameStatus.WIN) {
				winningRowIndex.value = currRow;
			}
		}
		privateState.gameStatus = newGameStatus;

		// --- Side Effects ---
		messageStore.clearGameStartMessage();

		return true;
	}, 250);

	async function resetGame() {
		await resetProgress(GameMode.WORDLE_DAILY);
		messageStore.showGameStartMessage();
		privateState.gameStatus = GameStatus.NOT_STARTED;
		winningRowIndex.value = null;
		restoredRows.value = 0;
	}

	async function initialize() {
		await initializeState();

		if (gameMode.value === GameMode.WORDLE_DAILY) {
			const wordle = await generateWordle(GameMode.WORDLE_DAILY);
			if (wordle !== solution.value) {
				await resetProgress(GameMode.WORDLE_DAILY, wordle);
			}
		}

		const gameStatus = evalGameStatus(
			solution.value,
			guesses.value,
			activeRowIndex.value,
		);
		privateState.gameStatus = gameStatus;

		const numOfGuesses = gameState.value.guesses.length;
		restoredRows.value = numOfGuesses;

		if (gameStatus === GameStatus.WIN) {
			winningRowIndex.value = numOfGuesses - 1;
		}

		if (!hasGameStarted.value) {
			messageStore.showGameStartMessage();
		}
	}

	return {
		gameStatus,
		solution,
		guesses,
		results,
		activeRowIndex,
		winningRowIndex,
		hasGameStarted,
		isGameOver,
		isHardModeEnabled,
		restoredRows,
		submitWord,
		initialize,
		resetGame,
	};
});
