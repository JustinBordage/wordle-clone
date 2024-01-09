import { MaybeRefOrGetter, toValue } from "vue";
import { computedAsync } from "@vueuse/core";
import { getWordsList } from "@/adapters/wordle";

export default function useIsValidWord(wordLength: MaybeRefOrGetter<number>) {
	const wordsList = computedAsync<string[]>(async () => {
		const size = toValue(wordLength);
		if (size < 4) return [];

		return await getWordsList(size);
	}, []);

	return function (wordToValidate: string) {
		return wordsList.value.includes(wordToValidate);
	};
}
