<script setup lang="ts">
	import { computed } from "vue";
	import GameMessage from "@/components/messages/GameMessage.vue";
	import { useMessageStore } from "@/stores/message";

	defineOptions({ name: "GameMessageManager" });

	const messageStore = useMessageStore();
	const msg = computed(() => messageStore.message);
</script>

<template>
	<div :class="$bem({})">
		<GameMessage v-if="msg" :msg="msg" />
	</div>
</template>

<style lang="scss">
	.game-message-manager {
		$padding: 0.625rem;
		width: fit-content;
		margin-inline: auto;
		height: 2rem + ($padding * 2);
		padding-block: $padding;

		// This grid ensures that the newest message is
		// displayed directly overtop of the last one.
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: "message";
	}
</style>
