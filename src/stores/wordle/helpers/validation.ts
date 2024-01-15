import GameTileState, { RevealedState } from "@/models/enums/GameTileState";
import { GuessRestriction } from "@/stores/wordle/composables/useGuessRestrictions";
import { appendOrdinal } from "@/utils/string";

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

export function validateGuessRestrictions(
	restrictions: GuessRestriction[],
	currGuess: string,
) {
	const guessWord = Array.from(currGuess.toUpperCase());

	const correctLetterError = restrictions
		.filter(({ state }) => state === GameTileState.CORRECT)
		.find(({ letter, index }) => {
			if (currGuess.charAt(index) === letter) {
				guessWord[index] = "";
				return false;
			} else {
				return true;
			}
		});

	if (correctLetterError) {
		const { index, letter } = correctLetterError;
		return `${appendOrdinal(index + 1)} letter must be '${letter}'`;
	}

	const presentLetterError = restrictions
		.filter(({ state }) => state === GameTileState.PRESENT)
		.find(({ letter }) => {
			const letterIndex = guessWord.indexOf(letter);
			if (letterIndex !== -1) {
				guessWord[letterIndex] = "";
				return false;
			} else {
				return true;
			}
		});

	if (presentLetterError) {
		return `Guess must contain '${presentLetterError.letter}'`;
	}

	return null;
}
