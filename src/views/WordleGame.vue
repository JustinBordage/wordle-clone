<script setup lang="ts">
	import { computed, onBeforeMount, onUnmounted, ref } from "vue";
	import GameBoard from "@/components/GameBoard.vue";
	import GameHeader from "@/components/GameHeader.vue";
	import GenerateWordleDialog from "@/components/generator/GenerateWordleDialog.vue";
	import GameKeyboard from "@/components/keyboard/GameKeyboard.vue";
	import GameMessageManager from "@/components/messages/GameMessageManager.vue";
	import GameRulesDialog from "@/components/rules/GameRulesDialog.vue";
	import GameSettingsDialog from "@/components/settings/GameSettingsDialog.vue";
	import GameStatsDialog from "@/components/statistics/GameStatsDialog.vue";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "WordleGame" });

	// ----- Data -----
	const isLoading = ref(true);
	const currGuess = ref("");
	const showGameRules = ref(false);
	const showStatistics = ref(false);
	const showSettings = ref(false);
	const showGenerator = ref(false);
	/** Used to prevent inputs while the
	 *  tile flip animation is running. */
	const preventKeyInput = ref(false);

	const wordleStore = useWordleStore();

	// ----- Computed -----
	const isAnyModalVisible = computed(
		() =>
			showGameRules.value ||
			showGenerator.value ||
			showStatistics.value ||
			showSettings.value,
	);

	// ----- Methods -----
	const VALID_KEYS = /[A-Za-z]/;

	async function pressKey(key: string) {
		if (
			wordleStore.isGameOver ||
			isAnyModalVisible.value ||
			preventKeyInput.value
		) {
			return;
		}

		switch (key) {
			case "Backspace":
				currGuess.value = currGuess.value.slice(0, -1);
				break;
			case "Enter":
				const isSuccessful = await wordleStore.submitWord(
					currGuess.value,
				);
				if (isSuccessful) {
					preventKeyInput.value = true;
					currGuess.value = "";
				}
				break;
			default:
				if (key.length === 1 && VALID_KEYS.test(key)) {
					const newGuess = currGuess.value + key.toUpperCase();
					if (newGuess.length <= wordleStore.solution.length) {
						currGuess.value = newGuess;
					}
				}
				break;
		}
	}

	function onBeforeInput(event: KeyboardEvent) {
		const { key, altKey, ctrlKey } = event;
		if (!altKey && !ctrlKey) pressKey(key);
	}

	function onRevealEnd() {
		preventKeyInput.value = false;
		if (wordleStore.isGameOver) {
			showStatistics.value = true;
		}
	}

	// ----- Lifecycle Methods -----
	onBeforeMount(async () => {
		await wordleStore.initialize();
		isLoading.value = false;

		document.addEventListener("keydown", onBeforeInput);
	});

	onUnmounted(() => {
		document.removeEventListener("keydown", onBeforeInput);
	});
</script>

<template>
	<div v-if="!isLoading" :class="$bem({})">
		<GameHeader
			@openRules="showGameRules = true"
			@openGenerator="showGenerator = true"
			@openStats="showStatistics = true"
			@openSettings="showSettings = true"
		/>
		<GameMessageManager />
		<GameBoard :currGuess="currGuess" @revealComplete="onRevealEnd" />
		<GameKeyboard @pressKey="pressKey" />
		<!-- Game Dialogs/Modals -->
		<GameRulesDialog v-model:isVisible="showGameRules" />
		<GameStatsDialog v-model:isVisible="showStatistics" />
		<GameSettingsDialog v-model:isVisible="showSettings" />
		<GenerateWordleDialog v-model:isVisible="showGenerator" />
	</div>
</template>

<style lang="scss">
	.wordle-game {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
