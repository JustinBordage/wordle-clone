import { useMersenneTwister } from "@/composables/useMersenneTwister";

export function usePickRandomWord(seed?: number) {
	const { randomInt } = useMersenneTwister(seed);

	return function pickRandomWord(wordList: string[]) {
		return wordList[randomInt(0, wordList.length)];
	};
}
