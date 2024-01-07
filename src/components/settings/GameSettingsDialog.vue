<script setup lang="ts">
	import { computed, inject } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameSettingToggle from "./GameSettingToggle.vue";
	import useColorBlindTheme from "@/composables/settings/useColorBlindTheme";
	import useDarkTheme from "@/composables/settings/useDarkTheme";
	import { HARD_MODE_ENABLED } from "@/configuration/provider-keys";

	defineOptions({ name: "GameSettingsDialog" });

	const hardMode = inject(HARD_MODE_ENABLED, false);
	const isDarkThemeEnabled = useDarkTheme();
	const isColorBlindThemeEnabled = useColorBlindTheme();

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
		<GameSettingToggle title="Dark Theme" v-model="isDarkThemeEnabled" />
		<GameSettingToggle
			title="Color Blind Mode"
			description="High contrast colors"
			v-model="isColorBlindThemeEnabled"
		/>
	</Modal>
</template>

<style lang="scss"></style>
