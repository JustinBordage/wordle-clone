<script setup lang="ts">
	defineOptions({ name: "GameStat" });

	withDefaults(
		defineProps<{
			label: string;
			value: number;
			wrapLabel?: boolean;
		}>(),
		{
			wrapLabel: true,
		},
	);
</script>

<template>
	<div :class="$bem({})">
		<var :class="$bem({ e: 'value' })">
			{{ value }}
		</var>
		<label :class="$bem({ e: 'label', m: { wrap: wrapLabel } })">
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
			font-style: normal;
			letter-spacing: 0.05em;
			font-variant-numeric: proportional-nums;
		}

		&__label {
			font-size: 0.75rem;
			min-width: 41px;
			width: 100%;

			&--wrap {
				width: min-content;
			}
		}
	}
</style>
