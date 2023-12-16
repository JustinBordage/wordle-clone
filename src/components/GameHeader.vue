<script setup lang="ts">
	import { Icon } from "@iconify/vue";
	import Button from "primevue/button";

	defineOptions({ name: "GameHeader" });

	defineEmits<{
		(e: "openRules");
		(e: "openStats");
		(e: "openSettings");
	}>();
</script>

<template>
	<header class="game-header">
		<span class="control-set" @click="$emit('openRules')">
			<Button class="control">
				<Icon icon="mdi:help-circle" />
			</Button>
		</span>
		<h1 class="title">WORDLE</h1>
		<span class="control-set">
			<Button class="control" @click="$emit('openStats')">
				<Icon icon="mdi:poll" />
			</Button>
			<Button class="control" @click="$emit('openSettings')">
				<Icon icon="mdi:cog" />
			</Button>
		</span>
	</header>
</template>

<style lang="scss">
	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 31rem;
		margin-bottom: 2.5rem;
		border-bottom: 0.0625rem solid var(--color-tone-3);
	}

	.control-set {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		width: 6.25rem;

		&:last-of-type {
			justify-content: flex-end;
		}
	}

	.control {
		display: inline-flex;
		width: fit-content;
		min-width: initial;
		padding: 0.25rem;
		font-size: 1.5rem;
		color: var(--color-tone-3);
		background-color: transparent;
	}

	.title {
		display: block;
		text-align: center;
		letter-spacing: 0.2rem;
		width: 100%;
		margin: 0;
	}
</style>