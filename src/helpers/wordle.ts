import { getWordsList } from "@/adapters/wordle";
import { randomInt } from "@/utils/RandomUtils";

export async function generateWordle() {
	const words = await getWordsList(5);
	if (words.length === 0) {
		throw new Error("Failed to generate Wordle!");
	}

	return words[randomInt(0, words.length)];
}