<script setup lang="ts">
	import { computed } from "vue";
	import { RevealedState } from "@/models/enums/GameTileState";

	defineOptions({ name: "KeyboardKey" });

	defineEmits<{
		(e: "pressKey", value: string);
	}>();

	const props = defineProps<{
		value: string;
		state?: RevealedState;
	}>();

	const isOneAndAHalf = computed(() => props.value.length > 1);
</script>

<template>
	<button
		:class="
			$bem({
				m: {
					'one-and-a-half': isOneAndAHalf,
					'evaluated': state !== undefined,
				},
			})
		"
		:aria-label="value"
		:data-state="state"
		@click="$emit('pressKey', value)"
	>
		<slot>
			{{ value }}
		</slot>
	</button>
</template>

<style lang="scss">
	$keyWidth: 2.75rem;

	button.keyboard-key {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		font-weight: bold;
		text-transform: uppercase;
		border: 0;
		padding: 0;
		width: $keyWidth;
		height: 3.625rem;
		border-radius: 0.25rem;
		cursor: pointer;
		user-select: none;
		background-color: var(--key-bg);
		color: var(--key-text-color);
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);

		&--evaluated {
			color: var(--key-evaluated-text-color);
		}

		&--one-and-a-half {
			width: $keyWidth * 1.5;
			min-width: $keyWidth * 1.5;
		}

		&[data-state="ABSENT"] {
			background-color: var(--color-absent);
		}

		&[data-state="PRESENT"] {
			background-color: var(--color-present);
		}

		&[data-state="CORRECT"] {
			background-color: var(--color-correct);
		}
	}
</style>
