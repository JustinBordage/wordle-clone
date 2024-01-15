<script setup lang="ts">
	import { computed } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameSettingToggle from "./GameSettingToggle.vue";
	import useColorBlindTheme from "@/composables/settings/useColorBlindTheme";
	import useDarkTheme from "@/composables/settings/useDarkTheme";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "GameSettingsDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const wordleStore = useWordleStore();
	const isDarkThemeEnabled = useDarkTheme();
	const isColorBlindThemeEnabled = useColorBlindTheme();

	const visible = computed({
		get(): boolean {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});

	const preventHardModeToggle = computed(
		() => !wordleStore.isHardModeEnabled && wordleStore.hasGameStarted,
	);
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
			:disabled="preventHardModeToggle"
			v-model="wordleStore.isHardModeEnabled"
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
