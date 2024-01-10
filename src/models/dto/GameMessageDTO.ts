import { GameMessageType } from "@/models/enums/GameMessageType";

export type GameMessageDTO = {
	id: string;
	text: string;
	type: GameMessageType;
};
