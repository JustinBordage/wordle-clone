<script setup lang="ts">
	import { ref, watch } from "vue";
	import GameTileAnimation from "@/models/enums/GameTileAnimation";
	import GameTileState from "@/models/enums/GameTileState";

	defineOptions({ name: "GameTile" });

	const props = defineProps<{
		state: GameTileState;
		letter: string;
	}>();

	const tileRef = ref<HTMLDivElement>();
	const animation = ref(GameTileAnimation.IDLE);

	watch(
		() => props.state,
		function (newState, oldState) {
			if (
				newState === GameTileState.TBD &&
				oldState === GameTileState.EMPTY
			) {
				animation.value = GameTileAnimation.POP;
				tileRef.value?.addEventListener(
					"animationend",
					() => {
						animation.value = GameTileAnimation.IDLE;
					},
					{ once: true },
				);
			}
		},
		{ immediate: true },
	);
</script>

<template>
	<div
		class="game-tile tile"
		:data-state="state"
		:data-animation="animation"
		ref="tileRef"
	>
		{{ letter }}
	</div>
</template>

<style lang="scss">
	@use "@/styles/wordle/animations.scss" as anims;

	$emptyTileBorder: 2px solid;

	@include anims.PopIn;
	@include anims.FlipIn;
	@include anims.FlipOut;

	.game-tile {
		$size: 3.875rem;
		width: $size;
		height: $size;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		line-height: 2rem;
		font-weight: bold;
		text-transform: uppercase;
		border: 0.125rem solid black;
	}

	.tile {
		&[data-state="EMPTY"] {
			border: $emptyTileBorder var(--color-tone-4);
		}

		&[data-state="TBD"] {
			background-color: var(--color-tone-7);
			border: $emptyTileBorder var(--color-tone-3);
			color: var(--color-tone-1);
		}

		&[data-state="ABSENT"] {
			background-color: var(--color-absent);
		}

		&[data-state="PRESENT"] {
			background-color: var(--color-present);
		}

		&[data-state="CORRECT"] {
			background-color: var(--color-correct);
		}

		&[data-animation="pop"] {
			animation-name: PopIn;
			animation-duration: 100ms;
		}

		&[data-animation="flip-in"],
		&[data-animation="flip-out"] {
			animation-duration: 250ms;
			animation-timing-function: ease-in;
		}

		&[data-animation="flip-in"] {
			animation-name: FlipIn;
		}

		&[data-animation="flip-out"] {
			animation-name: FlipOut;
		}
	}
</style>