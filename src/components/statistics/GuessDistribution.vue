<script setup lang="ts">
	import type { ChartData, ChartOptions } from "chart.js";
	import { Bar as BarChart } from "vue-chartjs";

	defineOptions({ name: "GuessDistribution" });

	// The "withDefaults" is temporary until I
	// complete the rest of the statistics behavior.
	const props = withDefaults(
		defineProps<{
			isCompleted?: boolean;
			guessIndex?: number;
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

	const chartData: ChartData<"bar", number[]> = {
		labels: ["1", "2", "3", "4", "5", "6"],
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
				data: [0, 0, 0, 0, 0, 1],
				minBarLength: 26,
			},
		],
	} as const;
</script>

<template>
	<div :class="$bem({})">
		<h4 :class="$bem({ e: 'title' })">Guess Distribution</h4>
		<BarChart
			:class="$bem({ e: 'chart' })"
			:options="chartOptions"
			:data="chartData"
		/>
	</div>
</template>

<style lang="scss">
	.guess-distribution {
		&__title {
			text-align: center;
			margin: 0.375rem 0;
		}
	}
</style>
