<script setup lang="ts">
	import type { ChartData, ChartOptions } from "chart.js";
	import { Bar as BarChart } from "vue-chartjs";

	defineOptions({ name: "GuessDistribution" });

	const chartOptions: ChartOptions<"bar"> = {
		responsive: true,
		scales: {
			y: {
				ticks: {
					beginAtZero: true,
					callback(value: number): number | void {
						if (value % 1 === 0) {
							return value;
						}
					},
				},
			},
		},
	} as const;

	const chartData: ChartData<"bar", number[]> = {
		labels: ["1", "2", "3", "4", "5", "6"],
		datasets: [
			{
				label: "# of Guesses",
				backgroundColor: "#fff",
				data: [0, 0, 0, 0, 0, 1],
			},
		],
	} as const;
</script>

<template>
	<div class="guess-distribution">
		<h4 class="guess-distribution__title">Guess Distribution</h4>
		<BarChart
			id="guess-distribution__chart"
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