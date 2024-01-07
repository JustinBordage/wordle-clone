<script setup lang="ts">
	import { computed, ref } from "vue";
	import TextInput from "primevue/inputtext";
	import Button from "primevue/button";
	import Modal from "@/components/common/Modal.vue";

	defineOptions({ name: "GenerateWordleDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const passPhrase = ref("");

	const visible = computed({
		get(): boolean {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});

	function restrictLength(event: InputEvent) {
		const { inputType, data } = event;
		if (inputType !== "insertText" || !data) return;

		if (passPhrase.value.length + data.length > 11) {
			event.preventDefault();
		}
	}

	function copyWordleLink() {
		// TODO: Check if submitted word is valid
		// TODO: Obfuscate the word
		// TODO: Generate the link
		// TODO: Copy the link to the clipboard
		console.warn("Work in progress feature...\n", passPhrase.value);
	}
</script>

<template>
	<Modal
		:class="$bem({})"
		title="Wordle Generator"
		:centered="true"
		v-model:isVisible="visible"
	>
		<div :class="$bem({ e: 'wrapper' })">
			<p :class="$bem({ e: 'description' })">
				Challenge your friend with any word from 4 to 11 letters:
			</p>
			<TextInput
				:class="$bem({ e: 'word-input' })"
				placeholder="Your word..."
				v-model="passPhrase"
				@beforeinput="restrictLength"
			/>
			<Button @click="copyWordleLink"> Copy Link</Button>
		</div>
	</Modal>
</template>

<style lang="scss">
	.generate-wordle-dialog {
		&__wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		&__word-input {
			width: 100%;
			margin-bottom: 2rem;
		}
	}
</style>
