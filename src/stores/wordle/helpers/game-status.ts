import { MAX_GUESSES } from "@/configuration/constants";
import GameStatus, { GameOutcome } from "@/models/enums/GameStatus";

function isGameWon(solution: string, guesses: string[]) {
	return guesses.includes(solution.toUpperCase());
}

function hasUsedAllGuesses(activeRow: number) {
	return activeRow >= MAX_GUESSES;
}

export function evalGameStatus(
	solution: string,
	guesses: string[],
	rowIndex: number,
): GameStatus {
	if (isGameWon(solution, guesses)) {
		return GameStatus.WIN;
	} else if (hasUsedAllGuesses(rowIndex)) {
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
