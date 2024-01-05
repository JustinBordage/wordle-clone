<script setup lang="ts">
	import { computed, inject, ref } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameSettingToggle from "./GameSettingToggle.vue";
	import { HARD_MODE_ENABLED } from "@/configuration/provider-keys";

	defineOptions({ name: "GameSettingsDialog" });

	const hardMode = inject(HARD_MODE_ENABLED, false);
	const isDarkMode = ref(true);
	const isColorBlindMode = ref(false);

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const visible = computed({
		get(): boolean {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});
</script>

<template>
	<Modal
		:class="$bem({})"
		title="Settings"
		:centered="true"
		v-model:isVisible="visible"
	>
		<GameSettingToggle
			title="Hard Mode"
			description="Any revealed hints must be used in subsequent guesses"
			v-model="hardMode"
		/>
		<GameSettingToggle title="Dark Theme" v-model="isDarkMode" />
		<GameSettingToggle
			title="Color Blind Mode"
			description="High contrast colors"
			v-model="isColorBlindMode"
		/>
	</Modal>
</template>

<style lang="scss"></style>
