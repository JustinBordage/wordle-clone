<script setup lang="ts">
	import { computed } from "vue";
	import GameTile from "@/components/GameTile.vue";
	import GameTileState from "@/models/enums/GameTileState.ts";

	defineOptions({ name: "GameRulesExample" });

	const props = defineProps<{
		exampleWord: string;
		revealIndex: number;
		state: GameTileState;
	}>();

	const word = computed(() => Array.from(props.exampleWord));
</script>

<template>
	<div class="game-example">
		<div class="game-example__row">
			<GameTile
				v-for="(letter, index) in word"
				:key="`${letter}-${index}`"
				:letter="letter"
				:state="index === revealIndex ? state : GameTileState.TBD"
			/>
		</div>
		<p class="game-example__description">
			<slot />
		</p>
	</div>
</template>

<style lang="scss">
	.game-example {
		&__row {
			--tile-size: 2.5rem;
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			gap: 0.375rem;
		}
	}
</style>