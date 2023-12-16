<script setup lang="ts">
	import { computed, onUnmounted, ref } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import useKeyHold from "@/composables/useKeyHold.ts";
	import { useShakeElement } from "@/composables/useShakeElement.ts";
	import { validateWordle } from "@/composables/useWordleCheck.ts";
	import GameTileState from "@/models/enums/GameTileState.ts";

	defineOptions({ name: "WordRow" });

	const props = defineProps<{
		solution: string;
		guess: string;
		isRevealed: boolean;
		rowIndex: number;
		isActiveRow: boolean;
	}>();

	const row = ref<HTMLDivElement | null>(null);

	const isIncomplete = computed(
		() => props.solution.length !== props.guess.length,
	);

	const paddedGuess = computed(() => {
		const solutionLength = props.solution.length;
		return props.guess
			.padEnd(props.solution.length, " ")
			.slice(0, solutionLength);
	});

	const tileState = computed(() => {
		const wordle = props.solution;
		const guess = props.guess;

		if (!props.isRevealed) {
			return Array(wordle.length)
				.fill(GameTileState.TBD, 0, guess.length)
				.fill(GameTileState.EMPTY, guess.length);
		} else {
			return validateWordle(wordle, guess);
		}
	});

	const { isHeld, stop } = useKeyHold("Enter");
	useShakeElement(
		row,
		() => props.isActiveRow && isHeld.value && isIncomplete.value,
	);

	onUnmounted(stop);
</script>

<template>
	<div class="word-row" ref="row">
		<GameTile
			v-for="(letter, index) in paddedGuess"
			:key="`${rowIndex}--${index}`"
			:letter="letter"
			:state="tileState[index]!!"
		/>
	</div>
</template>

<style lang="scss">
	@use "@/styles/wordle/animations" as anims;

	@include anims.Shake;

	.wrapper {
		display: flex;
		flex-flow: column;
	}

	.word-row {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 0.375rem;

		&.shake {
			animation-name: Shake;
			animation-duration: 100ms;
			animation-iteration-count: infinite;
		}
	}
</style>