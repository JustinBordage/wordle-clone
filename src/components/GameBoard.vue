<script setup lang="ts">
	import WordRow from "@/components/WordRow.vue";

	defineOptions({ name: "GameBoard" });

	defineProps<{
		solution: string;
		maxGuesses: number;
		guesses: string[];
		activeRow: number;
	}>();
</script>

<template>
	<div class="game-board">
		<WordRow
			v-for="index in maxGuesses"
			:key="`${solution}-${index}`"
			:solution="solution"
			:isRevealed="activeRow >= index"
			:rowIndex="index"
			:isActiveRow="activeRow === index - 1"
			:guess="guesses[index - 1] ?? ''"
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