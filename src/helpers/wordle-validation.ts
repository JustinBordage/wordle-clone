import { WORDLE_LENGTH } from "@/configuration/magic-numbers";

/** Checks if any guesses have been made.
 *
 *  @remark This does not check if any of the guesses
 *   are valid words. It will have to rely on the passed
 *   in guesses list only contains validated words. */
export function hasGameStarted(
	revealedGuesses: string[],
	solutionLength: number = WORDLE_LENGTH,
) {
	const guessPattern = new RegExp(`^[A-Z]{${solutionLength}}$`, "i");
	return revealedGuesses.some(guess => guessPattern.test(guess));
}
