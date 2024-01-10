<script setup lang="ts">
	import { computed } from "vue";
	import type { ChartData, ChartOptions } from "chart.js";
	import { Bar as BarChart } from "vue-chartjs";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "GuessDistribution" });

	const GUESS_DISTRIBUTION_LABELS: string[] = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
	] as const;

	const props = defineProps<{
		distribution: Record<`${number}`, number>;
		hasPlayedGame: boolean;
	}>();

	const chartOptions: ChartOptions<"bar"> = {
		responsive: true,
		indexAxis: "y",
		aspectRatio: 1.5,
		scales: {
			x: {
				ticks: {
					display: false,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
			},
			datalabels: {
				color: "#fff",
				font: {
					weight: "bold",
				},
				align: "start",
				anchor: "end",
			},
		},
	} as const;

	const wordleStore = useWordleStore();

	const guessDistributionData = computed(() =>
		GUESS_DISTRIBUTION_LABELS.map(label => {
			return props.distribution[label] ?? 0;
		}),
	);

	const guessResultColors = computed(() => {
		const compStyle = getComputedStyle(document.body);
		return {
			absent: compStyle.getPropertyValue("--color-absent"),
			present: compStyle.getPropertyValue("--color-present"),
			correct: compStyle.getPropertyValue("--color-correct"),
		};
	});

	const chartData = computed<ChartData<"bar", number[]>>(() => ({
		labels: GUESS_DISTRIBUTION_LABELS,
		datasets: [
			{
				label: "# of Guesses",
				backgroundColor: ({ dataIndex }) => {
					// TODO: Figure out how to get the color from the CSS theme vars.
					if (
						wordleStore.isGameOver &&
						dataIndex === wordleStore.winningRowIndex
					) {
						return guessResultColors.value.correct;
					}

					return guessResultColors.value.absent;
				},
				data: guessDistributionData.value,
				minBarLength: 26,
			},
		],
	}));
</script>

<template>
	<div :class="$bem({})">
		<h4 :class="$bem({ e: 'title' })">Guess Distribution</h4>
		<BarChart
			v-if="hasPlayedGame"
			:class="$bem({ e: 'chart' })"
			:options="chartOptions"
			:data="chartData"
		/>
		<p v-else :class="$bem({ e: 'no-data' })">No game data found!</p>
	</div>
</template>

<style lang="scss">
	.guess-distribution {
		padding-bottom: 0.75rem;

		&__title {
			text-align: center;
			margin: 0.375rem 0;
		}

		&__no-data {
			text-align: center;
			margin: 0;
		}
	}
</style>
