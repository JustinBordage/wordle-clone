<script setup lang="ts">
	import { computed } from "vue";

	defineOptions({ name: "KeyboardKey" });

	const props = defineProps<{
		value: string;
	}>();

	const isOneAndAHalf = computed(() => props.value.length > 1);
</script>

<template>
	<button
		:class="`keyboard-key${isOneAndAHalf ? ' one-and-a-half' : ''}`"
		@click="$emit('keypress')"
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
		
		&.one-and-a-half {
			width: $keyWidth * 1.5;
			min-width: $keyWidth * 1.5;
		}
	}
</style>