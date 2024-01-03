import { getWordsList } from "@/adapters/wordle";
import { WORDLE_LENGTH } from "@/configuration/magic-numbers.ts";
import { randomInt } from "@/utils/RandomUtils";

export async function generateWordle() {
	const words = await getWordsList(WORDLE_LENGTH);
	if (words.length === 0) {
		throw new Error("Failed to generate Wordle!");
	}

	return words[randomInt(0, words.length)];
}
