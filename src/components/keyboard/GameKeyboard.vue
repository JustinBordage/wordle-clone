<script setup lang="ts">
	import { computed } from "vue";
	import { Icon } from "@iconify/vue";
	import KeyboardKey from "@/components/keyboard/KeyboardKey.vue";
	import { keepHighestState } from "@/helpers/tile-states";
	import { RevealedState } from "@/models/enums/GameTileState";
	import { useWordleStore } from "@/stores/wordle";

	defineOptions({ name: "GameKeyboard" });

	defineEmits<{
		(e: "pressKey", value: string);
	}>();

	const keyboardKeys = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
	] as const;

	const wordleStore = useWordleStore();

	const letterStates = computed(() => {
		return wordleStore.results.reduce<Record<string, RevealedState>>(
			(acc, resultRow, index) => {
				const guessWord = wordleStore.guesses[index] ?? "";

				resultRow.forEach((newLetterState, index) => {
					const letter = guessWord.charAt(index);
					if (letter === "") return;

					acc[letter] = keepHighestState(newLetterState, acc[letter]);
				});

				return acc;
			},
			{},
		);
	});
</script>

<template>
	<div :class="$bem({})">
		<div
			v-for="(keySet, rowIndex) in keyboardKeys"
			:key="`${rowIndex}-${keySet.join()}`"
			:class="$bem({ e: 'row', m: `${rowIndex}` })"
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
