import { computed, Ref } from "vue";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export default function useHardMode(hasGameStarted: Ref<boolean>) {
	const hardMode = useLocalStorage("hardModeEnabled", false, {
		serializer: StorageSerializers.boolean,
	});

	return computed({
		get(): boolean {
			return hardMode.value;
		},
		set(isHardMode: boolean) {
			if (!hasGameStarted.value || !isHardMode) {
				hardMode.value = isHardMode;
			} else if (import.meta.env.DEV) {
				console.warn(
					"Cannot toggle hard mode after the game has already started!",
				);
			}
		},
	});
}
