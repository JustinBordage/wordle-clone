<script setup lang="ts">
	import WordRow from "@/components/WordRow.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";

	defineOptions({ name: "GameBoard" });

	const props = defineProps<{
		solution: string;
		maxGuesses: number;
		guesses: string[];
		activeRow: number;
	}>();

	// ----- Composables -----
	const rowIds = useIdSetGenerator(() => props.maxGuesses);
</script>

<template>
	<div class="game-board">
		<WordRow
			v-for="(id, index) in rowIds"
			:key="id"
			:solution="solution"
			:isRevealed="activeRow > index"
			:isActiveRow="activeRow === index"
			:guess="guesses[index] ?? ''"
		/>
	</div>
</template>

<style lang="scss">
	.game-board {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		gap: 0.375rem;
	}
</style>