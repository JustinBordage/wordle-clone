import { useClipboard } from "@vueuse/core";

export default function useCopyToClipboard() {
	// noinspection JSDeprecatedSymbols
	const clipboard = useClipboard({ legacy: !!document.execCommand });

	return async (textToCopy: string): Promise<boolean> => {
		await clipboard.copy(textToCopy);
		return clipboard.copied.value;
	};
}
