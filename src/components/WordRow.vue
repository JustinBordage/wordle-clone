<script setup lang="ts">
	import { computed, onMounted, onUnmounted, ref, watch } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import useKeyHold from "@/composables/useKeyHold";
	import { useShakeElement } from "@/composables/useShakeElement";
	import GameTileState from "@/models/enums/GameTileState";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "WordRow" });

	const emit = defineEmits<{
		(e: "revealComplete");
	}>();

	const props = defineProps<{
		rowIndex: number;
		guess: string;
	}>();

	const wordleStore = useWordleStore();

	// ----- Data -----
	const row = ref<HTMLDivElement | null>(null);
	const isFlipRevealDone = ref(false);

	// ----- Computed -----
	const isActiveRow = computed(
		() => wordleStore.activeRowIndex === props.rowIndex,
	);
	const isRevealed = computed(
		() => wordleStore.activeRowIndex > props.rowIndex,
	);
	const isIncomplete = computed(
		() => wordleStore.solution.length !== props.guess.length,
	);
	const isRestoredRow = computed(
		() => props.rowIndex < wordleStore.restoredRows,
	);
	const showWinBounce = computed(() => {
		const isWinningRow = wordleStore.winningRowIndex === props.rowIndex;
		return (
			!isRestoredRow &&
			isWinningRow &&
			wordleStore.winningRowIndex !== null
		);
	});

	const tileStates = computed(() => {
		const { solution, results } = wordleStore;
		const { guess, rowIndex } = props;

		if (results.length <= rowIndex) {
			return Array(solution.length)
				.fill(GameTileState.TBD, 0, guess.length)
				.fill(GameTileState.EMPTY, guess.length);
		} else {
			return results[rowIndex];
		}
	});

	// ----- Methods -----
	function onRevealEnd(targetAnim: "Bounce" | "FlipOut", handler: Function) {
		row.value?.addEventListener(
			"animationend",
			function onRevealCompleted(e: AnimationEvent) {
				const { animationName, target } = e;
				if (animationName !== targetAnim) return;

				if (
					target instanceof HTMLElement &&
					target.matches(".game-tile:last-child")
				) {
					row.value?.removeEventListener(
						"animationend",
						onRevealCompleted,
					);
					handler();
				}
			},
		);
	}

	function handleRevealEnd() {
		if (row.value) {
			onRevealEnd("FlipOut", () => {
				isFlipRevealDone.value = true;
				if (!showWinBounce.value) {
					emit("revealComplete");
				} else {
					onRevealEnd("Bounce", () => {
						emit("revealComplete");
					});
				}
			});
		} else {
			emit("revealComplete");
		}
	}

	// ----- Composables -----
	const tileIds = useIdSetGenerator(() => wordleStore.solution.length);

	const { isHeld, stop } = useKeyHold("Enter");
	useShakeElement(
		row,
		() => isActiveRow.value && isHeld.value && isIncomplete.value,
	);

	// ----- Watchers -----
	watch(isRevealed, isRowRevealed => {
		if (!isRowRevealed) {
			// This resets the value if
			// "Play Again" is clicked.
			isFlipRevealDone.value = false;
		} else {
			handleRevealEnd();
		}
	});

	// ----- Lifecycle Methods -----
	onMounted(() => {
		if (isRevealed.value) {
			handleRevealEnd();
		}
	});

	onUnmounted(stop);
</script>

<template>
	<div :class="$bem({})" ref="row">
		<GameTile
			v-for="(id, index) in tileIds"
			:key="id"
			:isRestoredRow="isRestoredRow"
			:doBounce="showWinBounce && isFlipRevealDone"
			:letter="guess?.[index] ?? ' '"
			:state="tileStates[index]!!"
			:tileIndex="index"
		/>
	</div>
</template>

<style lang="scss">
	@use "@/styles/wordle/animations" as anims;

	@include anims.Shake;

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
