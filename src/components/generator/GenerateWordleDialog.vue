<script setup lang="ts">
	import { computed, ref } from "vue";
	import TextInput from "primevue/inputtext";
	import Button from "primevue/button";
	import Modal from "@/components/common/Modal.vue";
	import router from "@/router";
	import { View } from "@/router/views";
	import { obfuscateSolution } from "@/helpers/wordle-obfuscation";
	import { copyToClipboard } from "@/utils/clipboard";

	defineOptions({ name: "GenerateWordleDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const passPhrase = ref("");
	const userMsg = ref("");
	const isErrorMsg = ref(false);
	const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

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

	function setUserMessage(newMessage: string, isError: boolean) {
		userMsg.value = newMessage;
		isErrorMsg.value = isError;

		if (timeout.value) clearTimeout(timeout.value);
		timeout.value = setTimeout(() => {
			userMsg.value = "";
		}, 5000);
	}

	function copyWordleLink() {
		// TODO: Check if submitted word is a valid word.
		if (passPhrase.value.length < 4) {
			setUserMessage("Not a valid word!", true);
		}

		const obfuscatedWord = obfuscateSolution(passPhrase.value);

		const { origin } = document.location;
		const route = router.resolve({
			name: View.WORDLE_CHALLENGE,
			params: {
				solution: obfuscatedWord,
			},
		});

		copyToClipboard(`${origin}${route.fullPath}`);
		setUserMessage("Link Copied!", false);
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
			<p :class="$bem({ e: 'user-msg', m: { error: isErrorMsg } })">
				{{ userMsg }}
			</p>
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
		}

		&__user-msg {
			height: 1.5rem;
			margin: 0.25rem 0 1rem;
			color: #3bb867;

			&--error {
				color: #d36b8d;
			}
		}
	}
</style>
