<script setup lang="ts">
	import { computed } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import GameTileState from "@/models/enums/GameTileState";

	defineOptions({ name: "GameRulesExample" });

	const props = defineProps<{
		exampleWord: string;
		revealIndex: number;
		state: GameTileState;
	}>();

	const word = computed(() => Array.from(props.exampleWord));
</script>

<template>
	<div :class="$bem({})">
		<div :class="$bem({ e: 'row' })">
			<GameTile
				v-for="(letter, index) in word"
				:key="`${letter}-${index}`"
				:class="$bem({ e: 'tile' })"
				:letter="letter"
				:tileIndex="0"
				:state="index === revealIndex ? state : GameTileState.TBD"
			/>
		</div>
		<p :class="$bem({ e: 'description' })">
			<slot />
		</p>
	</div>
</template>

<style lang="scss">
	.game-rules-example {
		&__row {
			--tile-size: 2.5rem;
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			gap: 0.375rem;
		}

		&__tile {
			&[data-state="ABSENT"] {
				border-color: var(--color-absent);
			}

			&[data-state="PRESENT"] {
				border-color: var(--color-present);
			}

			&[data-state="CORRECT"] {
				border-color: var(--color-correct);
			}
		}
	}
</style>
