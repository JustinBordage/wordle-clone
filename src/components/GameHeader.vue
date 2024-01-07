<script setup lang="ts">
	import { Icon } from "@iconify/vue";
	import WordleGeneratorIcon from "@/assets/generate-wordle.svg";

	defineOptions({ name: "GameHeader" });

	defineEmits<{
		(e: "openRules");
		(e: "openGenerator");
		(e: "openStats");
		(e: "openSettings");
	}>();
</script>

<template>
	<header :class="$bem({})">
		<span :class="$bem({ e: 'control-set' })">
			<button :class="$bem({ e: 'control' })" @click="$emit('openRules')">
				<Icon icon="mdi:help-circle" />
			</button>
			<button
				:class="$bem({ e: 'control' })"
				@click="$emit('openGenerator')"
			>
				<span :class="$bem({ e: 'generator-icon' })">
					<WordleGeneratorIcon />
				</span>
			</button>
		</span>
		<h1 :class="$bem({ e: 'title' })">WORDLE</h1>
		<span :class="$bem({ e: 'control-set' })">
			<button :class="$bem({ e: 'control' })" @click="$emit('openStats')">
				<Icon icon="mdi:poll" />
			</button>
			<button
				:class="$bem({ e: 'control' })"
				@click="$emit('openSettings')"
			>
				<Icon icon="mdi:cog" />
			</button>
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
		padding-bottom: 0.25rem;

		&__control-set {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			width: 6.25rem;

			&:last-of-type {
				justify-content: flex-end;
			}
		}

		&__control {
			display: inline-flex;
			align-items: center;
			width: fit-content;
			min-width: initial;
			padding: 0.25rem;
			font-size: 1.5rem;
			color: var(--color-tone-3);
			background-color: transparent;
			appearance: none;
		}

		&__generator-icon {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 2rem;
			height: 1.5rem;
			background-color: var(--color-tone-3);
			color: var(--surface-ground);
			border-radius: 0.25rem;
		}

		&__title {
			display: block;
			text-align: center;
			letter-spacing: 0.2rem;
			width: 100%;
			margin: 0;
		}
	}
</style>
