<script setup lang="ts">
	import Chip from "primevue/chip";
	import InfoIcon from "@/assets/icons/messages/info-icon.svg";
	import WarningIcon from "@/assets/icons/messages/warning-icon.svg";
	import SuccessIcon from "@/assets/icons/messages/success-icon.svg";
	import { GameMessageDTO } from "@/models/dto/GameMessageDTO";
	import { GameMessageType } from "@/models/enums/GameMessageType";

	defineOptions({ name: "GameMessage" });

	defineProps<{
		msg: GameMessageDTO;
	}>();
</script>

<template>
	<Transition>
		<Chip :class="$bem({ m: msg.type })" :key="msg.id">
			<span :class="$bem({ e: 'icon' })">
				<InfoIcon v-if="msg.type === GameMessageType.INFO" />
				<WarningIcon v-else-if="msg.type === GameMessageType.WARNING" />
				<SuccessIcon v-else-if="msg.type === GameMessageType.SUCCESS" />
			</span>
			{{ msg.text }}
		</Chip>
	</Transition>
</template>

<style lang="scss">
	@use "@/styles/wordle/animations.scss" as anims;

	@include anims.PopIn;

	.game-message {
		gap: 0.5rem;
		padding: 0.25rem 0.5rem;
		width: fit-content;
		height: fit-content;
		animation-name: PopIn;
		animation-duration: 100ms;
		grid-area: message;
		z-index: 1;
		opacity: 1;

		&--warning {
			background-color: var(--color-present);
			color: black;
		}

		&--success {
			background-color: var(--color-correct);
			color: black;
		}

		&__icon {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 1.25rem;
			height: 1.25rem;
		}

		// This gets rid of the flicker
		// by delaying when the previous
		// message is deleted
		&.v {
			&-enter-active {
				transition: none;
			}

			&-leave-active {
				transition: opacity 1ms 10ms;
				z-index: 0;
			}

			&-leave-to {
				opacity: 0;
			}
		}
	}
</style>
