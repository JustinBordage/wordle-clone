<script setup lang="ts">
	import { reactive, watch } from "vue";
	import type { ChartData, ChartOptions } from "chart.js";
	import { Bar as BarChart } from "vue-chartjs";

	defineOptions({ name: "GuessDistribution" });

	const GUESS_DISTRIBUTION_LABELS: string[] = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
	] as const;

	// The "withDefaults" is temporary until I
	// complete the rest of the statistics behavior.
	const props = withDefaults(
		defineProps<{
			isCompleted?: boolean;
			guessIndex?: number;
			distribution: Record<`${number}`, number>;
			hasPlayedGame: boolean;
		}>(),
		{
			isCompleted: true,
			guessIndex: 5,
		},
	);

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

	function evalGuessDistributionData(): number[] {
		return GUESS_DISTRIBUTION_LABELS.map(label => {
			return props.distribution[label] ?? 0;
		});
	}

	const chartData: ChartData<"bar", number[]> = reactive({
		labels: GUESS_DISTRIBUTION_LABELS,
		datasets: [
			{
				label: "# of Guesses",
				backgroundColor: ({ dataIndex }) => {
					// TODO: Figure out how to get the color from the CSS theme vars.
					if (props.isCompleted && dataIndex === props.guessIndex) {
						return "#538d4e";
					}

					return "#3a3a3c";
				},
				data: evalGuessDistributionData(),
				minBarLength: 26,
			},
		],
	});

	watch(evalGuessDistributionData, distributionData => {
		chartData.datasets[0].data = distributionData;
	});
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
