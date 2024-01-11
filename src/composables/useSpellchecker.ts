import { computed, ComputedRef, MaybeRef, toValue } from "vue";
import { computedAsync } from "@vueuse/core";
import Typo from "typo-js";
import { getDictionaryFiles } from "@/adapters/dictionary";

export function useSpellchecker(language: MaybeRef<string> = "en") {
	const dictionary = computedAsync(
		() => getDictionaryFiles(toValue(language)),
		null,
	);
	const spellchecker: ComputedRef<Typo | null> = computed(() => {
		if (dictionary.value === null) {
			return null;
		}

		const { words, affix } = dictionary.value;
		return new Typo(toValue(language), affix, words);
	});

	return {
		isMisspelled(word: string) {
			if (!spellchecker.value) {
				return true;
			}

			return !spellchecker.value.check(word);
		},
	};
}
