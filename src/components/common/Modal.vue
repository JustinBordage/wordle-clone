<script setup lang="ts">
	import { computed } from "vue";
	import Dialog from "primevue/dialog";

	defineOptions({ name: "Modal" });

	const emit = defineEmits<{
		(e: "update:isVisible", value: boolean);
	}>();

	const props = defineProps<{
		title?: string;
		isVisible: boolean;
	}>();

	const visible = computed({
		get() {
			return props.isVisible;
		},
		set(newVisible: boolean) {
			emit("update:isVisible", newVisible);
		},
	});
</script>

<template>
	<Dialog class="modal" modal :draggable="false" v-model:visible="visible">
		<template v-if="title" #header>
			<h2 class="modal__title">{{ title }}</h2>
		</template>
		<slot />
	</Dialog>
</template>

<style lang="scss">
	.modal {
		max-width: 35.25rem;
		transform: translate(-50%, -50%);
		position: fixed;
		top: 50%;
		left: 50%;
		border: 1px solid var(--color-tone-6);
		background-color: var(--modal-content-bg);
		padding: 1rem;

		&__title {
			margin: 0;
		}

		& .p-dialog {
			&-header {
				padding: 0 0 0.25rem 1.5rem;

				&:not(:has(.modal__title)) {
					justify-content: flex-end;
				}
			}

			&-header-close {
				$size: 1.25rem;
				width: $size;
				height: $size;
				font-size: $size;
			}

			&-header,
			&-content {
				background-color: transparent;
			}

			&-content {
				padding-bottom: 0;
			}
		}
	}
</style>