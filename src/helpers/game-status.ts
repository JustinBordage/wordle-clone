import { type MaybeRef, toValue } from "vue";
import { MAX_GUESSES } from "@/configuration/magic-numbers";
import GameStatus, { type GameOutcome } from "@/models/enums/GameStatus";

function isGameWon(
	solution: MaybeRef<string>,
	revealedGuesses: MaybeRef<string[]>,
) {
	return toValue(revealedGuesses).includes(toValue(solution));
}

function hasUsedAllGuesses(activeRow: MaybeRef<number>) {
	return toValue(activeRow) >= MAX_GUESSES;
}

export function evalGameStatus(
	solution: MaybeRef<string>,
	revealedGuesses: MaybeRef<string[]>,
	activeRow: MaybeRef<number>,
): GameStatus {
	if (isGameWon(solution, revealedGuesses)) {
		return GameStatus.WIN;
	} else if (hasUsedAllGuesses(activeRow)) {
		return GameStatus.LOST;
	} else {
		return GameStatus.IN_PROGRESS;
	}
}

export function hasGameEnded(
	gameStatus: GameStatus,
): gameStatus is GameOutcome {
	return gameStatus === GameStatus.WIN || gameStatus === GameStatus.LOST;
}
