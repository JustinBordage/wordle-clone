import { getWordsList } from "@/adapters/wordle";
import { useGameMode } from "@/composables/useGameMode";
import { usePickRandomWord } from "@/composables/usePickRandomWord";
import { WORDLE_LENGTH } from "@/configuration/constants";
import { GameMode, isWordleDaily } from "@/models/enums/GameMode";
import { truncateTime } from "@/utils/date";

function getDailySeed(): number {
	return truncateTime(new Date()).getTime();
}

export async function generateWordle(gameMode: GameMode = useGameMode().value) {
	const words = await getWordsList(WORDLE_LENGTH);
	if (words.length === 0) {
		throw new Error("Failed to generate Wordle!");
	}

	const seed = isWordleDaily(gameMode) ? getDailySeed() : undefined;
	const pickRandomWord = usePickRandomWord(seed);

	return pickRandomWord(words);
}
