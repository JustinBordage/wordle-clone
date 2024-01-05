<script setup lang="ts">
	import { computed, inject, onUnmounted, ref } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import { useIdSetGenerator } from "@/composables/useIdSetGenerator";
	import useKeyHold from "@/composables/useKeyHold";
	import { useShakeElement } from "@/composables/useShakeElement";
	import { validateWordle } from "@/composables/useWordleCheck";
	import { DO_FAST_FLIP } from "@/configuration/provider-keys";
	import GameTileState from "@/models/enums/GameTileState";

	defineOptions({ name: "WordRow" });

	const props = defineProps<{
		solution: string;
		guess: string;
		isRevealed: boolean;
		isActiveRow: boolean;
	}>();

	// ----- Injects -----
	const doFastFlip = inject(DO_FAST_FLIP, false);

	// ----- Data -----
	const row = ref<HTMLDivElement | null>(null);

	// ----- Computed -----
	const isIncomplete = computed(
		() => props.solution.length !== props.guess.length,
	);

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

	// ----- Composables -----
	const tileIds = useIdSetGenerator(() => props.solution.length);

	const { isHeld, stop } = useKeyHold("Enter");
	useShakeElement(
		row,
		() => props.isActiveRow && isHeld.value && isIncomplete.value,
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
			:state="tileState[index]!!"
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
