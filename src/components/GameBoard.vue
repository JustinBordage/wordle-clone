<script setup lang="ts">
	import WordRow from "@/components/WordRow.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import { MAX_GUESSES } from "@/configuration/magic-numbers";

	defineOptions({ name: "GameBoard" });

	defineProps<{
		solution: string;
		guesses: string[];
		activeRow: number;
	}>();

	// ----- Composables -----
	const rowIds = useIdSetGenerator(() => MAX_GUESSES);
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
