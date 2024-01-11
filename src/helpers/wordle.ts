import { truncateTime } from "@/utils/date.ts";
import {
	englishDataset,
	englishRecommendedTransformers,
	RegExpMatcher,
} from "obscenity";
import { getWordsList } from "@/adapters/wordle";
import { useGameMode } from "@/composables/useGameMode";
import { usePickRandomWord } from "@/composables/usePickRandomWord";
import { WORDLE_LENGTH } from "@/configuration/magic-numbers";
import { GameMode } from "@/models/enums/GameMode";

function getProfanityChecker(): RegExpMatcher {
	return new RegExpMatcher({
		...englishDataset.build(),
		...englishRecommendedTransformers,
	});
}

function getDailySeed(): number {
	return truncateTime(new Date()).getTime();
}

/** Chooses a non-profane word as the Wordle, since we don't
 *  want the game to be teaching profanities to the users. */
function getSafeWord(wordList: string[], gameMode: GameMode): string {
	const seed =
		gameMode === GameMode.WORDLE_DAILY ? getDailySeed() : undefined;
	const pickRandomWord = usePickRandomWord(seed);

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

export async function generateWordle(gameMode: GameMode = useGameMode().value) {
	const words = await getWordsList(WORDLE_LENGTH);
	if (words.length === 0) {
		throw new Error("Failed to generate Wordle!");
	}

	return getSafeWord(words, gameMode);
}
