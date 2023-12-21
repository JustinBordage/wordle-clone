<script setup lang="ts">
	import { computed } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameStat from "@/components/statistics/GameStat.vue";
	import GuessDistribution from "@/components/statistics/GuessDistribution.vue";

	defineOptions({ name: "GameStatsDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		maxGuesses: number;
		isGameLost: boolean;
		solution: string;
		isVisible: boolean;
	}>();

	const visible = computed({
		get(): boolean {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});
</script>

<template>
	<Modal class="game-stats-dialog" v-model:isVisible="visible">
		<div v-if="isGameLost" class="game-stats__answer">
			<h4>The Wordle was:</h4>
			<var class="game-stats-dialog__answer-value">{{ solution }}</var>
		</div>
		<h4 class="game-stats-dialog__title">Statistics</h4>
		<div class="game-stats-dialog__wrapper">
			<GameStat label="Games Played" :value="0" />
			<GameStat label="Win %" :value="0" />
			<GameStat label="Current Streak" :value="0" />
			<GameStat label="Max Streak" :value="0" />
		</div>
		<GuessDistribution />
	</Modal>
</template>

<style lang="scss">
	.game-stats-dialog {
		& h4 {
			letter-spacing: 0.5px;
			text-transform: uppercase;
			margin: 0.375rem 0;
			text-align: center;
		}

		&__title {
			font-weight: 700;
		}

		&__answer {
			display: flex;
			flex-flow: column;
			align-items: center;
			background-color: #f008;
			margin-bottom: 1.5rem;
			border-radius: 0.5rem;
			padding: 0.5rem;
		}

		&__answer-value {
			text-transform: uppercase;
			letter-spacing: 0.5px;
			text-align: center;
		}

		&__wrapper {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			padding-bottom: 0.375rem;
		}
	}
</style>