<script setup lang="ts">
	import { computed } from "vue";
	import Button from "primevue/button";
	import Modal from "@/components/common/Modal.vue";
	import GameStat from "@/components/statistics/GameStat.vue";
	import GuessDistribution from "@/components/statistics/GuessDistribution.vue";
	import GameStatus from "@/models/enums/GameStatus";
	import { useStatisticsStore } from "@/stores/statistics";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "GameStatsDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const statisticsStore = useStatisticsStore();
	const wordleStore = useWordleStore();

	const visible = computed({
		get(): boolean {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});

	const statistics = computed(() => statisticsStore.statistics);
	const winRatio = computed(() => {
		const { gamesPlayed, gamesLost } = statistics.value;
		if (gamesPlayed === 0) return 1;

		return (gamesPlayed - gamesLost) / gamesPlayed;
	});

	function playAgain() {
		visible.value = false;
		wordleStore.resetGame();
	}
</script>

<template>
	<Modal :class="$bem({})" v-model:isVisible="visible">
		<div :class="$bem({ e: 'wrapper' })">
			<div
				v-if="wordleStore.gameStatus === GameStatus.LOST"
				:class="$bem({ e: 'answer' })"
			>
				<h4>The Wordle was:</h4>
				<var :class="$bem({ e: 'solution' })">{{
					wordleStore.solution
				}}</var>
			</div>
			<h4 :class="$bem({ e: 'title' })">Statistics</h4>
			<div :class="$bem({ e: 'metrics' })">
				<GameStat
					label="Games Played"
					:value="statistics.gamesPlayed"
				/>
				<GameStat
					label="Win %"
					:value="winRatio * 100"
					:wrapLabel="false"
				/>
				<GameStat
					label="Current Streak"
					:value="statistics.winStreak"
				/>
				<GameStat
					label="Max Streak"
					:value="statistics.highestWinStreak"
				/>
			</div>
			<GuessDistribution
				:hasPlayedGame="statistics.gamesPlayed > 0"
				:distribution="statistics.guessDistribution"
			/>
			<div
				v-if="wordleStore.isGameOver"
				:class="$bem({ e: 'game-options' })"
			>
				<Button
					:class="$bem({ e: 'button' })"
					aria-label="Play Again"
					@click="playAgain"
				>
					Play again
				</Button>
			</div>
		</div>
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

		&__wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		&__title {
			font-weight: 700;
		}

		&__answer {
			display: flex;
			flex-flow: column;
			align-items: center;
			background-color: #f008;
			margin: 1rem 0 1.5rem;
			border-radius: 0.5rem;
			padding: 0.5rem;
		}

		&__solution {
			text-transform: uppercase;
			letter-spacing: 0.5px;
			text-align: center;
		}

		&__metrics {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			padding-bottom: 0.375rem;
			gap: 0.5rem;
		}

		&__game-options {
			display: flex;
			flex-direction: row;
			justify-content: center;
		}

		&__button {
			font-size: 1.25rem;
			background-color: var(--key-bg-correct);
			color: var(--key-evaluated-text-color);
			border: none;
			outline: none;
		}
	}
</style>
