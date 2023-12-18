<script setup lang="ts">
	import { Icon } from "@iconify/vue";
	import KeyboardKey from "@/components/keyboard/KeyboardKey.vue";

	defineOptions({ name: "GameKeyboard" });

	const keyboardKeys = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
	];
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
				:value="key"
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