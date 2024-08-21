<script setup lang="ts">
	import { computed, ref } from "vue";
	import { useRouter } from "vue-router";
	import TextInput from "primevue/inputtext";
	import Button from "primevue/button";
	import Modal from "@/components/common/Modal.vue";
	import useCopyToClipboard from "@/composables/useCopyToClipboard";
	import { useSpellchecker } from "@/composables/useSpellchecker";
	import { obfuscateSolution } from "@/helpers/wordle-obfuscation";
	import { GameMode } from "@/models/enums/GameMode";

	defineOptions({ name: "GenerateWordleDialog" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		isVisible: boolean;
	}>();

	const router = useRouter();
	const copyToClipboard = useCopyToClipboard();
	const { isMisspelled } = useSpellchecker();

	const customGuess = ref("");
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

		if (customGuess.value.length + data.length > 11) {
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

	async function copyWordleLink() {
		if (customGuess.value.length < 4 || isMisspelled(customGuess.value)) {
			setUserMessage("Not a valid word!", true);
			return;
		}

		const obfuscatedWord = obfuscateSolution(customGuess.value);

		const { origin } = document.location;
		const route = router.resolve({
			name: GameMode.WORDLE_CHALLENGE,
			params: {
				solution: obfuscatedWord,
			},
		});

		const isCopied = await copyToClipboard(`${origin}${route.fullPath}`);
		if (isCopied) setUserMessage("Link Copied!", false);
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
				v-model="customGuess"
				@beforeinput="restrictLength"
			/>
			<p :class="$bem({ e: 'user-msg', m: { error: isErrorMsg } })">
				{{ userMsg }}
			</p>
			<Button :class="$bem({ e: 'copy-link' })" @click="copyWordleLink">
				Copy Link
			</Button>
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

		&__copy-link {
			background-color: var(--key-bg-correct);
			color: var(--key-evaluated-text-color);
			border: none;
		}
	}
</style>
