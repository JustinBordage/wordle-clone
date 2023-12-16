enum GameTileState {
	EMPTY = "EMPTY",
	TBD = "TBD",
	ABSENT = "ABSENT",
	PRESENT = "PRESENT",
	CORRECT = "CORRECT",
}

export default GameTileState;

export type RevealedState =
	| GameTileState.ABSENT
	| GameTileState.PRESENT
	| GameTileState.CORRECT;