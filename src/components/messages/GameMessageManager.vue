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
		<GameMessage v-if="msg" :key="msg.id" :msg="msg" />
	</div>
</template>

<style lang="scss">
	.game-message-manager {
		$padding: 0.625rem;
		width: 100%;
		height: 2rem + ($padding * 2);
		padding-block: $padding;
	}
</style>
