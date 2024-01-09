<script setup lang="ts">
	import { computed, onUnmounted, ref } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import useKeyHold from "@/composables/useKeyHold";
	import { useShakeElement } from "@/composables/useShakeElement";
	import GameTileState from "@/models/enums/GameTileState";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "WordRow" });

	const props = defineProps<{
		rowIndex: number;
		guess: string;
	}>();

	const wordleStore = useWordleStore();

	// ----- Data -----
	const row = ref<HTMLDivElement | null>(null);

	// ----- Computed -----
	const isActiveRow = computed(
		() => wordleStore.activeRowIndex === props.rowIndex,
	);
	const isIncomplete = computed(
		() => wordleStore.solution.length !== props.guess.length,
	);
	const doFastFlip = computed(
		() => props.rowIndex < wordleStore.restoredRows,
	);

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

	// ----- Composables -----
	const tileIds = useIdSetGenerator(() => wordleStore.solution.length);

	const { isHeld, stop } = useKeyHold("Enter");
	useShakeElement(
		row,
		() => isActiveRow.value && isHeld.value && isIncomplete.value,
	);

	// ----- Lifecycle Methods -----
	onUnmounted(stop);
</script>

<template>
	<div :class="$bem({})" ref="row">
		<GameTile
			v-for="(id, index) in tileIds"
			:key="id"
			:doFastFlip="doFastFlip"
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
