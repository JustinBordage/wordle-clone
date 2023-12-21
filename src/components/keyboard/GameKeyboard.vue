<script setup lang="ts">
	import { computed } from "vue";
	import { Icon } from "@iconify/vue";
	import KeyboardKey from "@/components/keyboard/KeyboardKey.vue";
	import GameTileState from "@/models/enums/GameTileState.ts";

	defineOptions({ name: "GameKeyboard" });

	defineEmits<{
		(e: "pressKey", value: string);
	}>();

	const props = defineProps<{
		results: GameTileState[][];
		revealedGuesses: string[];
	}>();

	const keyboardKeys = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
	] as const;

	const letterStates = computed(() => {
		return props.results.reduce<Record<string, GameTileState>>(
			(acc, resultRow, index) => {
				const guessWord = props.revealedGuesses[index] ?? "";

				resultRow.forEach((newLetterState, index) => {
					const letter = guessWord.charAt(index);
					if (letter === "") return;

					const currLetterState = acc[letter];
					if (
						getStatePriority(newLetterState) >
						getStatePriority(currLetterState)
					) {
						acc[letter] = newLetterState;
					}
				});

				return acc;
			},
			{},
		);
	});

	function getStatePriority(state: GameTileState) {
		switch (state) {
			case GameTileState.ABSENT:
				return 1;
			case GameTileState.PRESENT:
				return 2;
			case GameTileState.CORRECT:
				return 3;
			default:
				return 0;
		}
	}
</script>

<template>
	<div class="game-keyboard">
		<div
			v-for="(keySet, rowIndex) in keyboardKeys"
			:key="`${rowIndex}-${keySet.join()}`"
			:class="`game-keyboard__row game-keyboard__row--${rowIndex}`"
		>
			<KeyboardKey
				v-for="(key, colIndex) in keySet"
				:key="`${rowIndex}-${colIndex}-${key}`"
				:state="letterStates[key]"
				:value="key"
				@pressKey="$emit('pressKey', $event)"
			>
				<Icon
					v-if="key === 'Backspace'"
					icon="mdi:backspace-outline"
					style="font-size: 24px"
				/>
			</KeyboardKey>
		</div>
	</div>
</template>

<style lang="scss">
	.game-keyboard {
		display: flex;
		flex-flow: column;
		row-gap: 0.375rem;
		width: 520px;
		margin-top: 40px;

		&__row {
			display: flex;
			width: fit-content;
			flex-flow: row nowrap;
			align-items: center;
			gap: 0.375rem;
			margin: auto;
		}
	}
</style>