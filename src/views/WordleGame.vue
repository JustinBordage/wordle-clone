<script setup lang="ts">
	import {
		computed,
		nextTick,
		onBeforeMount,
		onUnmounted,
		provide,
		ref,
	} from "vue";
	import { useThrottleFn } from "@vueuse/core";
	import GameBoard from "@/components/GameBoard.vue";
	import GameHeader from "@/components/GameHeader.vue";
	import GameKeyboard from "@/components/keyboard/GameKeyboard.vue";
	import GameMessageManager from "@/components/messages/GameMessageManager.vue";
	import GameRulesDialog from "@/components/rules/GameRulesDialog.vue";
	import GameSettingsDialog from "@/components/settings/GameSettingsDialog.vue";
	import GameStatsDialog from "@/components/statistics/GameStatsDialog.vue";
	import useGameState from "@/composables/useGameState";
	import useGameStatistics from "@/composables/useGameStatistics";
	import useIsValidWord from "@/composables/useIsValidWord";
	import { validateWordle } from "@/composables/useWordleCheck";
	import { MAX_GUESSES } from "@/configuration/magic-numbers";
	import {
		DO_FAST_FLIP,
		HARD_MODE_ENABLED,
	} from "@/configuration/provider-keys";
	import { evalGameStatus, hasGameEnded } from "@/helpers/game-status";
	import { hasGameStarted } from "@/helpers/wordle-validation";
	import { GameMessageType } from "@/models/enums/GameMessageType";
	import GameStatus from "@/models/enums/GameStatus";
	import GameTileState, { RevealedState } from "@/models/enums/GameTileState";
	import { useMessageStore } from "@/stores/message";
	import { isNotNull } from "@/utils/validation";

	defineOptions({ name: "WordleGame" });

	// ----- Data -----
	const solution = ref("");
	const gameStatus = ref(GameStatus.NOT_STARTED);
	const results = ref<RevealedState[][]>(Array(MAX_GUESSES));
	const guesses = ref<string[]>(Array(MAX_GUESSES).fill(""));

	const showGameRules = ref(false);
	const showStatistics = ref(false);
	const showSettings = ref(false);
	// This will be used to disable the inputs
	// while the "flip" animation is running.
	const disabled = ref(false);
	/** Used to trigger a faster flipping animation when
	 *  loading the game state from local storage.
	 *
	 *  @remark This is a bit of a hacky solution,
	 *   so I may refactor it later. */
	const doFastFlip = ref(true);

	const messageStore = useMessageStore();

	// ----- Computed -----
	const activeRow = computed(
		() => results.value.filter(result => !!result).length,
	);
	const revealedGuesses = computed(() =>
		guesses.value.slice(0, activeRow.value),
	);
	const isGameOver = computed(() => hasGameEnded(gameStatus.value));

	const guess = computed({
		get: () => guesses.value[activeRow.value],
		set(newGuess: string) {
			if (newGuess.length <= solution.value.length) {
				guesses.value[activeRow.value] = newGuess;
			}
		},
	});

	// ----- Methods -----
	const submitWord = useThrottleFn(() => {
		const currGuess = guess.value;
		if (solution.value.length !== currGuess.length) return;

		if (!isValidWord(currGuess)) {
			messageStore.setMessage(
				GameMessageType.WARNING,
				"This word is not valid!",
			);
			return;
		}

		if (revealedGuesses.value.includes(currGuess)) {
			messageStore.setMessage(
				GameMessageType.WARNING,
				"This word has already been used!",
			);
			return;
		}

		const currRow = activeRow.value;
		if (currRow < MAX_GUESSES) {
			disabled.value = true;
			doFastFlip.value = false;

			const result = validateWordle(solution.value, currGuess);
			persistGuess(result, currGuess);

			results.value[currRow] = result;
			const newGameStatus = evalGameStatus(
				solution,
				revealedGuesses,
				activeRow,
			);

			// This comes before the "gameStatus" ref is updated so
			// the change is reflected before the dialog is shown.
			if (hasGameEnded(newGameStatus)) {
				const numOfGuesses = currRow + 1;
				saveGameResults(newGameStatus, numOfGuesses);

				if (newGameStatus === GameStatus.WIN) {
					messageStore.showWinMessage(numOfGuesses);
				}
			}

			gameStatus.value = newGameStatus;
		}
	}, 250);

	const VALID_KEYS = /[A-Za-z]/;

	function pressKey(key: string) {
		if (isGameOver.value) return;

		switch (key) {
			case "Backspace":
				guess.value = guess.value.slice(0, -1);
				return;
			case "Enter":
				submitWord();
				return;
			default:
				if (key.length === 1 && VALID_KEYS.test(key)) {
					guess.value = guess.value + key.toUpperCase();
				}
				return;
		}
	}

	function onBeforeInput(event: KeyboardEvent) {
		const { key, altKey, ctrlKey } = event;
		if (!altKey && !ctrlKey) pressKey(key);
	}

	function restoreGameArray<T extends GameTileState[] | string>(items: T[]) {
		const gameData = Array(MAX_GUESSES);
		gameData.splice(0, items.length, ...items);
		return gameData;
	}

	async function restoreGameState() {
		const gameState = await getStoredGameState();
		solution.value = gameState.solution;

		const restoredResults = gameState.results.filter(isNotNull);
		results.value = restoreGameArray(restoredResults);
		guesses.value = restoreGameArray(gameState.guesses).fill(
			"",
			gameState.guesses.length,
		);

		gameStatus.value = evalGameStatus(solution, revealedGuesses, activeRow);
	}

	async function playAgain() {
		showStatistics.value = false;
		await nextTick();

		await resetGame();
		await restoreGameState();
		messageStore.showGameStartMessage();
	}

	// ----- Composables -----
	const isValidWord = useIsValidWord(() => solution.value.length);
	const { hardMode, getStoredGameState, persistGuess, resetGame } =
		useGameState();
	const { saveGameResults } = useGameStatistics(true);

	// ----- Providers -----
	provide(HARD_MODE_ENABLED, hardMode);
	provide(DO_FAST_FLIP, doFastFlip);

	// ----- Lifecycle Methods -----
	onBeforeMount(async () => {
		await restoreGameState();

		if (!hasGameStarted(revealedGuesses.value, solution.value.length)) {
			messageStore.showGameStartMessage();
		}

		document.addEventListener("keydown", onBeforeInput);
	});

	onUnmounted(() => {
		document.removeEventListener("keydown", onBeforeInput);
	});
</script>

<template>
	<div v-if="solution !== ''" :class="$bem({})">
		<GameHeader
			@openRules="showGameRules = true"
			@openStats="showStatistics = true"
			@openSettings="showSettings = true"
		/>
		<GameMessageManager />
		<GameBoard
			:isGameOver="isGameOver"
			:solution="solution"
			:activeRow="activeRow"
			:guesses="guesses"
			@openStats="showStatistics = true"
		/>
		<GameKeyboard
			:results="results"
			:revealedGuesses="revealedGuesses"
			@pressKey="pressKey"
		/>
		<GameRulesDialog v-model:isVisible="showGameRules" />
		<GameStatsDialog
			v-model:isVisible="showStatistics"
			:solution="solution"
			:gameStatus="gameStatus"
			@playAgain="playAgain"
		/>
		<GameSettingsDialog v-model:isVisible="showSettings" />
	</div>
</template>

<style lang="scss">
	.wordle-game {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
