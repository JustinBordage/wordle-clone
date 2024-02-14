import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useThrottleFn } from "@vueuse/core";
import useGameState from "./composables/useGameState";
import { useGuessRestrictions } from "./composables/useGuessRestrictions";
import useHardMode from "./composables/useHardMode";
import { useSpellchecker } from "@/composables/useSpellchecker";
import { MAX_GUESSES } from "@/configuration/constants";
import { evalGameStatus, hasGameEnded } from "./helpers/game-status";
import { validateGuessRestrictions, validateRow } from "./helpers/validation";
import { GameMessageType } from "@/models/enums/GameMessageType";
import { GameMode } from "@/models/enums/GameMode";
import GameStatus from "@/models/enums/GameStatus";
import { useMessageStore } from "@/stores/message";
import { useStatisticsStore } from "@/stores/statistics";

export const useWordleStore = defineStore("wordle", () => {
	const messageStore = useMessageStore();
	const statisticsStore = useStatisticsStore();
	const { gameState, resetProgress, persistGuess, initializeState } =
		useGameState();
	const { isMisspelled } = useSpellchecker();
	const guessRestrictions = useGuessRestrictions(gameState);
	const isHardModeEnabled = useHardMode();

	// ----- State -----
	const gameStatus = ref(GameStatus.NOT_STARTED);
	const winningRowIndex = ref<number | null>(null);
	const restoredRows = ref(0);
	/** The row which the keyboard can "see"
	 *  for revealing the keyboard key states.
	 *
	 *  @remark This is an exclusive value. */
	const keyboardRowNum = ref(0);

	// ----- Getters -----
	const solution = computed(() => gameState.value.solution);
	const guesses = computed(() => gameState.value.guesses);
	const results = computed(() => gameState.value.results);
	const activeRowIndex = computed(() => guesses.value.length);
	const hasGameStarted = computed(() => activeRowIndex.value > 0);
	const isGameOver = computed(() => hasGameEnded(gameStatus.value));

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

		if (isHardModeEnabled.value) {
			const errorMsg = validateGuessRestrictions(
				guessRestrictions.value,
				guess,
			);
			if (errorMsg !== null) {
				messageStore.setMessage(GameMessageType.WARNING, errorMsg);
				return false;
			}
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
		gameStatus.value = newGameStatus;

		messageStore.clearGameStartMessage();

		return true;
	}, 250);

	async function resetGame() {
		await resetProgress(GameMode.WORDLE_UNLIMITED);
		messageStore.showGameStartMessage();
		gameStatus.value = GameStatus.NOT_STARTED;
		winningRowIndex.value = null;
		restoredRows.value = 0;
		keyboardRowNum.value = 0;
	}

	async function initialize() {
		await initializeState();

		const newGameStatus = evalGameStatus(
			solution.value,
			guesses.value,
			activeRowIndex.value,
		);
		gameStatus.value = newGameStatus;

		const numOfGuesses = guesses.value.length;
		restoredRows.value = numOfGuesses;

		if (newGameStatus === GameStatus.WIN) {
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
		keyboardRowNum,
		hasGameStarted,
		isGameOver,
		isHardModeEnabled,
		restoredRows,
		submitWord,
		initialize,
		resetGame,
	};
});
