import { MaybeRefOrGetter, toValue } from "vue";
import { computedAsync } from "@vueuse/core";
import { getWordsList } from "@/adapters/wordle";

export default function useIsValidWord(wordLength: MaybeRefOrGetter<number>) {
	const wordsList = computedAsync<string[]>(
		async () => await getWordsList(toValue(wordLength)),
		[],
	);

	return function (wordToValidate: string) {
		return wordsList.value.includes(wordToValidate);
	};
}
