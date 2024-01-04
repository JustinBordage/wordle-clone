<script setup lang="ts">
	import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
	import { computedAsync } from "@vueuse/core";
	import GameHeader from "@/components/GameHeader.vue";
	import GameBoard from "@/components/GameBoard.vue";
	import GameRulesDialog from "@/components/rules/GameRulesDialog.vue";
	import GameStatsDialog from "@/components/statistics/GameStatsDialog.vue";
	import GameKeyboard from "@/components/keyboard/GameKeyboard.vue";
	import { MAX_GUESSES } from "@/configuration/magic-numbers.ts";
	import { validateWordle } from "@/composables/useWordleCheck";
	import { generateWordle } from "@/helpers/wordle";
	import GameTileState from "@/models/enums/GameTileState";

	defineOptions({ name: "WordleGame" });

	const results = ref<GameTileState[][]>(Array(MAX_GUESSES));
	const guesses = ref<string[]>(Array(MAX_GUESSES).fill(""));
	const activeRow = ref(0);

	const showStatistics = ref(false);
	const showGameRules = ref(false);
	// This will be used to disable the inputs
	// while the "flip" animation is running.
	const disabled = ref(false);

	const solution = computedAsync(generateWordle, "");
	const revealedGuesses = computed(() =>
		guesses.value.slice(0, activeRow.value),
	);
	const isGameWon = computed(() =>
		revealedGuesses.value.includes(solution.value),
	);
	const isGameLost = computed(
		() => activeRow.value >= MAX_GUESSES && !isGameWon.value,
	);
	const isGameOver = computed(() => isGameLost.value || isGameWon.value);

	const guess = computed({
		get: () => guesses.value[activeRow.value],
		set(newGuess: string) {
			if (newGuess.length <= solution.value.length) {
				guesses.value[activeRow.value] = newGuess;
			}
		},
	});

	const submitWord = () => {
		if (solution.value.length !== guess.value.length) return;

		// TODO: Perform other validation like
		//  - Is it a valid word
		const currRow = activeRow.value;
		const currWord = guess.value;
		if (currRow < MAX_GUESSES) {
			disabled.value = true;
			results.value[currRow] = validateWordle(solution.value, currWord);
			activeRow.value++;
		}
	};

	const VALID_KEYS = /[A-Za-z]/;

	function pressKey(key: string) {
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

	watch(isGameOver, gameIsOver => {
		if (gameIsOver) showStatistics.value = true;
	});

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
			:isGameLost="isGameLost"
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
