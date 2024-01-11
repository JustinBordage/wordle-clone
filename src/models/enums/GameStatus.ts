enum GameStatus {
	NOT_STARTED = "NOT_STARTED",
	IN_PROGRESS = "IN_PROGRESS",
	LOST = "LOST",
	WIN = "WIN",
}

export default GameStatus;

export type GameOutcome = GameStatus.WIN | GameStatus.LOST;
