import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export default function useColorBlindTheme() {
	return useLocalStorage("colorBlindTheme", true, {
		serializer: StorageSerializers.boolean,
	});
}
