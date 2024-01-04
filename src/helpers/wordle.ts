import {
	RegExpMatcher,
	englishDataset,
	englishRecommendedTransformers,
} from "obscenity";
import { getWordsList } from "@/adapters/wordle";
import { WORDLE_LENGTH } from "@/configuration/magic-numbers";
import { pickRandomWord } from "@/utils/RandomUtils";

function getProfanityChecker(): RegExpMatcher {
	return new RegExpMatcher({
		...englishDataset.build(),
		...englishRecommendedTransformers,
	});
}

/** Chooses a non-profane word as the Wordle, since we don't
 *  want the game to be teaching profanities to the users. */
function getSafeWord(wordList: string[]): string {
	const profanityChecker = getProfanityChecker();
	let wordle: string | null = null;
	let attempts = 0;

	while (wordle === null && attempts < 10) {
		const uncheckedWord = pickRandomWord(wordList);
		if (!profanityChecker.hasMatch(uncheckedWord)) {
			wordle = uncheckedWord;
		}
		attempts++;
	}

	if (wordle === null) {
		// While less efficient, this fallback
		// will guarantee a word is selected.
		const sanitizedWordList = wordList.filter(
			word => !profanityChecker.hasMatch(word),
		);
		wordle = pickRandomWord(sanitizedWordList);
	}

	return wordle;
}

export async function generateWordle() {
	const words = await getWordsList(WORDLE_LENGTH);
	if (words.length === 0) {
		throw new Error("Failed to generate Wordle!");
	}

	return getSafeWord(words);
}
