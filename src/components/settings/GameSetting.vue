<script setup lang="ts">
	import { isNotBlank } from "@/utils/string";

	defineOptions({ name: "GameSetting" });

	defineProps<{
		title: string;
		description?: string;
	}>();
</script>

<template>
	<div :class="$bem({})">
		<span :class="$bem({ e: 'info' })">
			<h3 :class="$bem({ e: 'title' })">{{ title }}</h3>
			<p
				v-if="isNotBlank(description)"
				:class="$bem({ e: 'description' })"
			>
				{{ description }}
			</p>
		</span>
		<span :class="$bem({ e: 'control' })">
			<slot />
		</span>
	</div>
</template>

<style lang="scss">
	$borderStyle: 0.0625rem solid var(--color-tone-4);

	.game-setting {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 1rem;
		border-bottom: $borderStyle;
		width: 30.125rem;

		&:first-child {
			margin-top: 1rem;
			border-top: $borderStyle;
		}

		&:last-child {
			margin-bottom: 0.5rem;
		}

		&__title,
		&__description {
			margin: 0;
		}

		&__title {
			font-size: 1.125rem;
			color: var(--color-tone-1);
		}

		&__description {
			font-size: 0.75rem;
			color: var(--color-tone-2);
		}
	}
</style>
