import { useLocalStorage } from "@vueuse/core";
import { MAX_GUESSES } from "@/configuration/magic-numbers";
import { generateWordle } from "@/helpers/wordle";
import { RevealedState } from "@/models/enums/GameTileState";
import { b64Decode, b64Encode } from "@/utils/base64";
import { deepClone } from "@/utils/cloning";
import { reverse } from "@/utils/string";

/** This is for when the solution hasn't yet been generated. Since the
 *  words list needs to be pulled with an asynchronous http request.
 *
 *  The length should be the same length as the generated Wordle. */
const SOLUTION_PLACEHOLDER = "_____";

export default function useGameState() {
	const gameState = useLocalStorage("gameState", initialGameStateSupplier, {
		serializer: {
			read(value: string): GameState {
				const rawState = JSON.parse(value);
				rawState.solution = deobfuscateSolution(rawState.solution);
				return rawState;
			},
			write({ solution, ...state }: GameState): string {
				return JSON.stringify({
					...state,
					solution: obfuscateSolution(solution),
				});
			},
		},
	});

	function persistGuess(evaluation: RevealedState[], guess: string) {
		const { results, guesses } = gameState.value;
		const nextGuessIndex = results.indexOf(null);
		if (nextGuessIndex !== -1) {
			results.splice(nextGuessIndex, 1, evaluation);
			guesses.splice(nextGuessIndex, 1, guess);
		}
	}

	/** Gets the game state that's persisted in local storage.
	 *
	 *  @remark This should only be called once when
	 *  initializing or resetting of the game state. */
	async function getStoredGameState(): Promise<GameState> {
		if (gameState.value.solution === SOLUTION_PLACEHOLDER) {
			const solution = await generateWordle();
			gameState.value = {
				...gameState.value,
				solution,
			};
		}

		return deepClone(gameState.value);
	}

	async function resetGame() {
		const solution = await generateWordle();
		const isHardMode = gameState.value.hardMode;
		gameState.value = initialGameStateSupplier(solution, isHardMode);
	}

	return {
		persistGuess,
		getStoredGameState,
		resetGame,
	};
}

type GameState = {
	guesses: string[];
	results: (RevealedState[] | null)[];
	/** The generated solution word, so it
	 *  persists through page refreshes.
	 *
	 *  @remark The value is obfuscated when serialized to
	 *   discourage cheating, not that it matters really. */
	solution: string;
	/** Can only be toggled before a game has started. */
	hardMode: boolean;
};

function initialGameStateSupplier(
	solution: string = SOLUTION_PLACEHOLDER,
	hardMode: boolean = false,
): GameState {
	return {
		guesses: Array(MAX_GUESSES).fill(""),
		results: Array(MAX_GUESSES).fill(null),
		solution,
		hardMode,
	};
}

/** Obfuscates the solution by encoding it
 *  in an unpadded base 64 format, reversing
 *  the result and then encoding in b64 again.
 *
 *  @remark This is NOT encryption, nor does it have to be! */
function obfuscateSolution(solution: string): string {
	let obfuscatedWord = b64Encode(solution, true);
	obfuscatedWord = reverse(obfuscatedWord);
	return b64Encode(obfuscatedWord, true);
}

/** De-obfuscates the solution */
function deobfuscateSolution(obfuscatedSolution: string): string {
	let deobfuscatedWord = b64Decode(obfuscatedSolution);
	deobfuscatedWord = reverse(deobfuscatedWord);
	return b64Decode(deobfuscatedWord);
}
