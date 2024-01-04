<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref, watch } from "vue";
	import GameTileAnimation from "@/models/enums/GameTileAnimation";
	import GameTileState, {
		isRevealedState,
	} from "@/models/enums/GameTileState";

	defineOptions({ name: "GameTile" });

	const props = withDefaults(
		defineProps<{
			state: GameTileState;
			letter: string;
			tileIndex?: number;
			doFastFlip?: boolean;
			isWinningRow?: boolean;
		}>(),
		{
			tileIndex: 0,
			doFastFlip: false,
			isWinningRow: false,
		},
	);

	const tileRef = ref<HTMLDivElement>();
	const animation = ref(GameTileAnimation.IDLE);
	const shownState = ref(GameTileState.EMPTY);

	watch(
		() => props.state,
		function (newState, oldState) {
			switch (newState) {
				case GameTileState.TBD:
					if (oldState === GameTileState.EMPTY) {
						animation.value = GameTileAnimation.POP;
					}
					break;
				case GameTileState.ABSENT:
				case GameTileState.PRESENT:
				case GameTileState.CORRECT:
					animation.value = GameTileAnimation.FLIP_IN;
					break;
			}

			if (!isRevealedState(newState)) {
				shownState.value = newState;
			}
		},
		{ immediate: true },
	);

	function returnToIdle() {
		if (animation.value === GameTileAnimation.FLIP_IN) {
			animation.value = GameTileAnimation.FLIP_OUT;
			shownState.value = props.state;
			return;
		}

		animation.value = GameTileAnimation.IDLE;
	}

	onMounted(() => {
		tileRef.value?.addEventListener("animationend", returnToIdle);
	});

	onBeforeUnmount(() => {
		tileRef.value?.removeEventListener("animationend", returnToIdle);
	});
</script>

<template>
	<div
		:class="$bem({ m: { 'fast-flip': doFastFlip, 'win': isWinningRow } })"
		:data-state="shownState"
		:data-animation="animation"
		ref="tileRef"
	>
		{{ letter }}
	</div>
</template>

<style lang="scss">
	@use "sass:math";
	@use "@/styles/wordle/animations.scss" as anims;

	@include anims.PopIn;
	@include anims.FlipIn;
	@include anims.FlipOut;
	@include anims.Bounce;

	.game-tile {
		$defaultSize: 3.875rem;
		width: var(--tile-size, $defaultSize);
		height: var(--tile-size, $defaultSize);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		line-height: 2rem;
		font-weight: bold;
		text-transform: uppercase;

		&[data-state="EMPTY"],
		&[data-state="TBD"] {
			border: 0.125rem solid transparent;
		}

		&[data-state="EMPTY"] {
			border-color: var(--color-tone-4);
		}

		&[data-state="TBD"] {
			background-color: var(--color-tone-7);
			border-color: var(--color-tone-3);
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

		&--win {
			animation-name: Bounce;
			animation-duration: 1000ms;
			animation-delay: calc(v-bind(tileIndex) * 100ms);
		}

		&[data-animation="pop"] {
			animation-name: PopIn;
			animation-duration: 100ms;
		}

		$defFlipDuration: 250ms;

		&--fast-flip {
			--flip-duration: #{math.div($defFlipDuration, 2)};
		}

		&[data-animation="flip-in"],
		&[data-animation="flip-out"] {
			animation-duration: $defFlipDuration;
			animation-timing-function: ease-in;
		}

		&[data-animation="flip-in"] {
			animation-name: FlipIn;
			animation-delay: calc(
				v-bind(tileIndex) * var(--flip-duration, $defFlipDuration)
			);
		}

		&[data-animation="flip-out"] {
			animation-name: FlipOut;
		}
	}
</style>
