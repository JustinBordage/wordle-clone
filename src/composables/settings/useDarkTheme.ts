import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export default function useDarkTheme() {
	return useLocalStorage("darkTheme", true, {
		serializer: StorageSerializers.boolean,
	});
}
