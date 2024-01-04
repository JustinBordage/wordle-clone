<script setup lang="ts">
	import {
		computed,
		onBeforeMount,
		onUnmounted,
		provide,
		ref,
		watch,
	} from "vue";
	import { computedAsync } from "@vueuse/core";
	import GameBoard from "@/components/GameBoard.vue";
	import GameHeader from "@/components/GameHeader.vue";
	import GameKeyboard from "@/components/keyboard/GameKeyboard.vue";
	import GameRulesDialog from "@/components/rules/GameRulesDialog.vue";
	import GameStatsDialog from "@/components/statistics/GameStatsDialog.vue";
	import useIsValidWord from "@/composables/useIsValidWord";
	import { validateWordle } from "@/composables/useWordleCheck";
	import { MAX_GUESSES } from "@/configuration/magic-numbers";
	import { DO_FAST_FLIP } from "@/configuration/provider-keys";
	import { evalGameStatus, hasGameEnded } from "@/helpers/game-status";
	import { generateWordle } from "@/helpers/wordle";
	import GameStatus from "@/models/enums/GameStatus";
	import GameTileState from "@/models/enums/GameTileState";

	defineOptions({ name: "WordleGame" });

	// ----- Data -----
	const gameStatus = ref(GameStatus.NOT_STARTED);
	const results = ref<GameTileState[][]>(Array(MAX_GUESSES));
	const guesses = ref<string[]>(Array(MAX_GUESSES).fill(""));

	const showStatistics = ref(false);
	const showGameRules = ref(false);
	// This will be used to disable the inputs
	// while the "flip" animation is running.
	const disabled = ref(false);
	/** Used to trigger a faster flipping animation when
	 *  loading the game state from local storage.
	 *
	 *  @remark This is a bit of a hacky solution,
	 *   so I may refactor it later. */
	const doFastFlip = ref(true);

	// ----- Computed -----
	const solution = computedAsync(generateWordle, "");
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
	const submitWord = () => {
		const currGuess = guess.value;
		if (solution.value.length !== currGuess.length) return;

		if (!isValidWord(currGuess)) {
			// TODO: Replace this with something less intrusive
			alert("This word is not valid!");
			return;
		}

		if (revealedGuesses.value.includes(currGuess)) {
			// TODO: Replace this with something less intrusive
			alert("This word has already been used!");
			return;
		}

		const currRow = activeRow.value;
		if (currRow < MAX_GUESSES) {
			disabled.value = true;
			doFastFlip.value = false;
			results.value[currRow] = validateWordle(solution.value, currGuess);
			gameStatus.value = evalGameStatus(
				solution,
				revealedGuesses,
				activeRow,
			);
		}
	};

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

	// ----- Composables -----
	const isValidWord = useIsValidWord(() => solution.value.length);

	// ----- Providers -----
	provide(DO_FAST_FLIP, doFastFlip);

	// ----- Watchers -----
	watch(isGameOver, gameIsOver => {
		if (gameIsOver) showStatistics.value = true;
	});

	// ----- Lifecycle Methods -----
	onBeforeMount(() => {
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
		/>
		<GameBoard
			:solution="solution"
			:activeRow="activeRow"
			:guesses="guesses"
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
			:isGameLost="gameStatus === GameStatus.LOST"
		/>
	</div>
</template>

<style lang="scss">
	.wordle-game {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
