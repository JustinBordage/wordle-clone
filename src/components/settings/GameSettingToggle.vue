<script setup lang="ts">
	import { computed } from "vue";
	import InputSwitch from "primevue/inputswitch";
	import GameSetting from "./GameSetting.vue";

	defineOptions({ name: "GameSettingToggle" });

	const emit = defineEmits<{
		(e: "update:modelValue", value: boolean);
	}>();

	const props = withDefaults(
		defineProps<{
			title: string;
			description?: string;
			modelValue: boolean;
			disabled?: boolean;
		}>(),
		{
			disabled: false,
		},
	);

	const value = computed({
		get(): boolean {
			return props.modelValue;
		},
		set(newValue: boolean) {
			emit("update:modelValue", newValue);
		},
	});
</script>

<template>
	<GameSetting :title="title" :description="description">
		<InputSwitch
			:class="$bem({ e: 'switch' })"
			:disabled="disabled"
			v-model="value"
		/>
	</GameSetting>
</template>
