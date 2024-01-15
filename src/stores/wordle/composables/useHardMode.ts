import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export default function useHardMode() {
	return useLocalStorage("hardModeEnabled", false, {
		serializer: StorageSerializers.boolean,
	});
}
