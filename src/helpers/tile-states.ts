import GameTileState from "@/models/enums/GameTileState";

export function getStatePriority(state: GameTileState) {
	switch (state) {
		case GameTileState.ABSENT:
			return 1;
		case GameTileState.PRESENT:
			return 2;
		case GameTileState.CORRECT:
			return 3;
		default:
			return 0;
	}
}

/** Keeps the Game Tile State with the highest priority level. */
export function keepHighestState<T extends GameTileState>(
	stateA: T,
	stateB: T,
): T {
	return getStatePriority(stateA) > getStatePriority(stateB)
		? stateA
		: stateB;
}
