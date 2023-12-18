<script setup lang="ts">
	import { computed } from "vue";
	import Dialog from "primevue/dialog";
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
		set(newIsVisible: boolean) {
			emit("update:isVisible", newIsVisible);
		},
	});
</script>

<template>
	<Dialog
		class="game-stats-dialog"
		modal
		:draggable="false"
		v-model:visible="visible"
	>
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
	</Dialog>
</template>

<style lang="scss">
	.game-stats-dialog {
		transform: translate(-50%, -50%);
		position: fixed;
		top: 50%;
		left: 50%;
		border: 1px solid var(--color-tone-6);
		background-color: var(--modal-content-bg);
		padding: 1rem;

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

		& .p-dialog {
			&-header {
				padding: 0 0 0.25rem;
				justify-content: flex-end;
			}

			&-header-close {
				$size: 1.25rem;
				width: $size;
				height: $size;
				font-size: $size;
			}

			&-header,
			&-content {
				background-color: transparent;
			}
		}
	}
</style>