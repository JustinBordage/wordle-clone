<script setup lang="ts">
	import { computed } from "vue";
	import Modal from "@/components/common/Modal.vue";
	import GameRulesExample from "@/components/rules/GameRulesExample.vue";
	import {
		MAX_GUESSES,
		WORDLE_LENGTH,
	} from "@/configuration/magic-numbers.ts";
	import GameTileState from "@/models/enums/GameTileState.ts";

	defineOptions({ name: "GameRulesDialog" });

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
</script>

<template>
	<Modal :class="$bem({})" title="HOW TO PLAY" v-model:isVisible="visible">
		<section>
			<p>Guess the <b>WORDLE</b> in {{ MAX_GUESSES }} tries.</p>
			<p>
				Each guess must be a valid {{ WORDLE_LENGTH }} letter word. Hit
				the enter button to submit.
			</p>
			<p>
				After each guess, the color of the tiles will change to show how
				close your guess was to the word.
			</p>
			<div :class="$bem({ e: 'examples' })">
				<p><b>Examples</b></p>
				<GameRulesExample
					exampleWord="WEARY"
					:revealIndex="0"
					:state="GameTileState.CORRECT"
				>
					The letter <b>W</b> is in the word and in the correct spot.
				</GameRulesExample>
				<GameRulesExample
					exampleWord="PILLS"
					:revealIndex="1"
					:state="GameTileState.PRESENT"
				>
					The letter <b>I</b> is in the word but in the wrong spot.
				</GameRulesExample>
				<GameRulesExample
					exampleWord="VAGUE"
					:revealIndex="3"
					:state="GameTileState.ABSENT"
				>
					The letter <b>U</b> is not in the word in any spot.
				</GameRulesExample>
			</div>
			<p><b>A new WORDLE will be available each day!</b></p>
		</section>
	</Modal>
</template>

<style lang="scss">
	.game-rules-dialog {
		font-size: 14px;

		&__examples {
			border-block: 1px solid var(--color-tone-4);
		}
	}
</style>
