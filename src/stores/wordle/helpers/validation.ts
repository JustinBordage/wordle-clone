import GameTileState, { RevealedState } from "@/models/enums/GameTileState";

export function validateRow(wordle: string, guess: string): RevealedState[] {
	const solution = Array.from(wordle.toUpperCase());
	const guessWord = Array.from(guess.toUpperCase());

	if (solution.join() === guessWord.join()) {
		return Array(wordle.length).fill(GameTileState.CORRECT);
	}

	// Validates letters in correct positions
	const result: RevealedState[] = solution.map((letter, index) => {
		if (guessWord[index] !== letter) {
			return GameTileState.ABSENT;
		}

		solution[index] = "";
		guessWord[index] = "";
		return GameTileState.CORRECT;
	});

	// Validates letters in incorrect positions
	guessWord.forEach((letter, guessIndex) => {
		if (letter === "") return;

		const index = solution.indexOf(letter);
		if (index !== -1) {
			result[guessIndex] = GameTileState.PRESENT;
			solution[index] = "";
		}
	});

	return result;
}
