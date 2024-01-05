<script setup lang="ts">
	import { onMounted, ref, watch } from "vue";
	import WordRow from "@/components/WordRow.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import { MAX_GUESSES } from "@/configuration/magic-numbers";

	defineOptions({ name: "GameBoard" });

	const emit = defineEmits<{
		(e: "openStats");
	}>();

	const props = defineProps<{
		isGameOver: boolean;
		solution: string;
		guesses: string[];
		activeRow: number;
	}>();

	// ----- Data -----
	const gameBoard = ref<HTMLDivElement | null>(null);

	// ----- Methods -----
	function onRevealCompleted(
		targetAnim: "FlipOut" | "Bounce",
		handler: Function,
	) {
		gameBoard.value?.addEventListener(
			"animationend",
			function onRevealCompleted(e: AnimationEvent) {
				const { animationName, target } = e;
				if (animationName !== targetAnim) return;

				if (
					target instanceof HTMLElement &&
					target.matches(".game-tile:last-child")
				) {
					gameBoard.value?.removeEventListener(
						"animationend",
						onRevealCompleted,
					);
					handler();
				}
			},
		);
	}

	function handleGameOver(gameIsOver: boolean) {
		if (gameIsOver) {
			if (gameBoard.value) {
				// TODO: Replace "FlipOut" with "Bounce" once it's implemented.
				onRevealCompleted("FlipOut", () => emit("openStats"));
			} else {
				emit("openStats");
			}
		}
	}

	// ----- Watchers -----
	watch(() => props.isGameOver, handleGameOver);

	// ----- Composables -----
	const rowIds = useIdSetGenerator(() => MAX_GUESSES);

	// ----- Lifecycle Methods -----
	onMounted(() => handleGameOver(props.isGameOver));
</script>

<template>
	<div :class="$bem({})" ref="gameBoard">
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
