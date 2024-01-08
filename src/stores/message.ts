import { computed } from "vue";
import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import { GameMessageDTO } from "@/models/dto/GameMessageDTO";
import { GameMessageType } from "@/models/enums/GameMessageType";

const usePrivateMessageState = defineStore({
	id: "privateMessageState",
	state: () => ({
		msg: null as GameMessageDTO | null,
		timeoutId: null as ReturnType<typeof setTimeout> | null,
	}),
});

export const useMessageStore = defineStore("message", () => {
	// ----- State -----
	const _state = usePrivateMessageState();

	// ----- Getters -----
	const message = computed<Readonly<GameMessageDTO> | null>(() => _state.msg);

	// ----- Actions -----
	/** Sets the current game message that
	 *  is displayed below the GameHeader.
	 *
	 *  @remark This will replace the previous message! */
	function setMessage(
		type: GameMessageType,
		text: string,
		hasTimeout: boolean = true,
	): GameMessageDTO {
		if (_state.timeoutId) {
			clearTimeout(_state.timeoutId);
			_state.timeoutId = null;
		}

		const id = nanoid();
		if (hasTimeout) {
			_state.timeoutId = setTimeout(() => {
				if (_state.msg?.id === id) {
					_state.msg = null;
				}
			}, 5000);
		}

		const gameMessage = {
			id,
			text,
			type,
		};

		_state.msg = gameMessage;
		return gameMessage;
	}

	/** Sets the game win based on how many guesses it took the user. */
	function showWinMessage(numOfGuesses: number) {
		let message = "";

		switch (numOfGuesses) {
			case 1:
				message = "Genius!";
				break;
			case 2:
				message = "Magnificent!";
				break;
			case 3:
				message = "Impressive!";
				break;
			case 4:
				message = "Splendid!";
				break;
			case 5:
				message = "Great!";
				break;
			case 6:
			default:
				message = "Phew!";
				break;
		}

		setMessage(GameMessageType.SUCCESS, message);
	}

	return {
		message,
		setMessage,
		showWinMessage,
	};
});
