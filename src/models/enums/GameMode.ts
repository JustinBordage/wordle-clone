export enum GameMode {
	/** The daily Wordle gamemode. */
	WORDLE_DAILY = "DAILY",
	/** The wordle unlimited gamemode. */
	WORDLE_UNLIMITED = "UNLIMITED",
	/** A user generated Wordle challenge gamemode. */
	WORDLE_CHALLENGE = "CHALLENGE",
}

export function isWordleDaily(gameMode: GameMode) {
	return gameMode === GameMode.WORDLE_DAILY;
}
