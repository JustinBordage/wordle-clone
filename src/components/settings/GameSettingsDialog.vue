<script setup lang="ts">
	import { computed, ref } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameSettingToggle from "./GameSettingToggle.vue";

	defineOptions({ name: "GameSettingsDialog" });

	const isHardMode = ref(false);
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

	const hardMode = computed({
		get(): boolean {
			return isHardMode.value;
		},
		set(hardMode: boolean) {
			isHardMode.value = hardMode;
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
