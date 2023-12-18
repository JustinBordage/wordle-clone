<script lang="ts" setup="">
	defineOptions({ name: "GameStat" });

	defineProps<{
		label: string;
		value: number;
	}>();
</script>

<template>
	<div class="game-stat">
		<var class="game-stat__value">
			{{ value }}
		</var>
		<label class="game-stat__label">
			{{ label }}
		</label>
	</div>
</template>

<style lang="scss">
	.game-stat {
		display: flex;
		flex-flow: column;

		&__value,
		&__label {
			text-align: center;
		}

		&__value {
			font-size: 2.25rem;
			font-weight: 400;
			max-height: fit-content;
		}

		&__label {
			width: 57px;
			font-size: 0.75rem;
		}
	}
</style>