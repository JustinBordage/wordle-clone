<script setup lang="ts">
	import { ref } from "vue";
	import WordRow from "@/components/WordRow.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import { MAX_GUESSES } from "@/configuration/magic-numbers";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "GameBoard" });

	defineEmits<{
		(e: "revealComplete");
	}>();

	const props = defineProps<{
		currGuess: string;
	}>();

	// ----- Stores -----
	const wordleStore = useWordleStore();

	// ----- Data -----
	const gameBoard = ref<HTMLDivElement | null>(null);

	// ----- Methods -----
	function getRowGuess(index: number) {
		if (index !== wordleStore.activeRowIndex) {
			return wordleStore.guesses[index] ?? "";
		} else {
			return props.currGuess;
		}
	}

	// ----- Composables -----
	const rowIds = useIdSetGenerator(() => MAX_GUESSES);
</script>

<template>
	<div :class="$bem({})" ref="gameBoard">
		<WordRow
			v-for="(id, index) in rowIds"
			:key="id"
			:guess="getRowGuess(index)"
			:rowIndex="index"
			@revealComplete="$emit('revealComplete')"
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
