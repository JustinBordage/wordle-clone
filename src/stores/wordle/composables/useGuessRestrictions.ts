import { computed, ComputedRef, Ref } from "vue";
import { GameState } from "@/stores/wordle/composables/useGameState";
import GameTileState, { RevealedState } from "@/models/enums/GameTileState";

/** The solution & all the guesses should be uppercase already.
 *
 *  @remark This is a "get it working" implementation,
 *   so it's likely unoptimized. */
export function useGuessRestrictions(
	gameState: Ref<GameState>,
): ComputedRef<GuessRestriction[]> {
	return computed(() => {
		const { solution, guesses, results } = gameState.value;

		const restrictions = Array.from(solution).map<GuessRestriction>(
			(letter, index) => ({
				letter,
				index,
				state: GameTileState.ABSENT,
			}),
		);

		/** Finds the first "ABSENT" restriction that matches the guess letter. */
		function findAbsentByGuessLetter(guessLetter: string) {
			return restrictions.findIndex(
				({ letter, state }) =>
					letter === guessLetter && state === GameTileState.ABSENT,
			);
		}

		results.forEach((guessResult, guessIndex) => {
			const guess = guesses[guessIndex];
			guessResult.forEach((letterState, letterIndex) => {
				if (letterState === GameTileState.ABSENT) return;

				let replaceIndex = -1;
				if (letterState === GameTileState.CORRECT) {
					replaceIndex = letterIndex;
				} else if (letterState === GameTileState.PRESENT) {
					replaceIndex = findAbsentByGuessLetter(guess[letterIndex]);
				}

				if (replaceIndex !== -1) {
					restrictions[replaceIndex] = {
						...restrictions[replaceIndex],
						state: letterState,
					};
				}
			});
		});

		return restrictions.filter(
			({ state }) => state !== GameTileState.ABSENT,
		);
	});
}

export type GuessRestriction = {
	letter: string;
	index: number;
	state: RevealedState;
};
