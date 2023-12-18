<script setup lang="ts">
	import GameKeyboard from "@/components/keyboard/GameKeyboard.vue";
	import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
	import GameHeader from "@/components/GameHeader.vue";
	import GameBoard from "@/components/GameBoard.vue";
	import GameStatsDialog from "@/components/statistics/GameStatsDialog.vue";
	import { validateWordle } from "@/composables/useWordleCheck.ts";
	import GameTileState from "@/models/enums/GameTileState.ts";

	const solution = "block";
	const maxGuesses = 6;

	const results = ref<GameTileState[][]>(Array(maxGuesses));
	const guesses = ref<string[]>(Array(maxGuesses).fill(""));
	const activeRow = ref(0);

	const showStatistics = ref(false);
	// This will be used to disable the inputs
	// while the "flip" animation is running.
	const disabled = ref(false);

	const isGameWon = computed(() =>
		guesses.value.slice(0, activeRow.value).includes(solution),
	);
	const isGameLost = computed(
		() => activeRow.value >= maxGuesses && !isGameWon.value,
	);
	const isGameOver = computed(() => isGameLost.value || isGameWon.value);

	const guess = computed({
		get: () => guesses.value[activeRow.value],
		set(newGuess: string) {
			if (newGuess.length <= solution.length) {
				guesses.value[activeRow.value] = newGuess;
			}
		},
	});

	const validKeys = /[A-Za-z]/;

	function onBeforeInput(event: KeyboardEvent) {
		const { key, altKey, ctrlKey } = event;
		if (altKey || ctrlKey) return;

		switch (key) {
			case "Backspace":
				guess.value = guess.value.slice(0, -1);
				return;
			case "Enter":
				if (solution.length !== guess.value.length) return;

				// TODO: Perform other validation like
				//  - Is it a valid word
				const currRow = activeRow.value;
				const currWord = guess.value;
				if (currRow < maxGuesses) {
					disabled.value = true;
					results.value[currRow] = validateWordle(solution, currWord);
					activeRow.value++;
				}
				return;
			default:
				if (key.length === 1 && validKeys.test(key)) {
					guess.value = guess.value + key.toUpperCase();
				}
				return;
		}
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
	<div class="app nightmode">
		<GameHeader @openStats="showStatistics = true" />
		<GameBoard
			:solution="solution"
			:maxGuesses="maxGuesses"
			:activeRow="activeRow"
			:guesses="guesses"
		/>
		<GameStatsDialog
			v-model:isVisible="showStatistics"
			:maxGuesses="maxGuesses"
			:solution="solution"
			:isGameLost="isGameLost"
		/>
		<GameKeyboard />
	</div>
</template>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>