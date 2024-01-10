import { useLocalStorage } from "@vueuse/core";
import { WORDLE_LENGTH } from "@/configuration/magic-numbers";
import { generateWordle } from "@/helpers/wordle";
import { RevealedState } from "@/models/enums/GameTileState";
import { b64Decode, b64Encode } from "@/utils/base64";
import { deepClone } from "@/utils/cloning";
import { reverse } from "@/utils/string";

/** This is for when the solution hasn't yet been generated. Since the
 *  words list needs to be pulled with an asynchronous http request.
 *
 *  The length should be the same length as the generated Wordle. */
const SOLUTION_PLACEHOLDER = "_".repeat(WORDLE_LENGTH);

/** This shouldn't be directly accessed. Instead, go through the "WordleStore" */
export default function useGameState() {
	const gameState = useLocalStorage(
		"gameState",
		() => ({
			guesses: [],
			results: [],
			solution: SOLUTION_PLACEHOLDER,
		}),
		{
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
		},
	);

	/** Sets the game's solution word.
	 *
	 *  @remark Setting this value will
	 *   wipe any existing game progress! */
	function setSolution(solution: string) {
		gameState.value = {
			guesses: [],
			results: [],
			solution,
		};
	}

	async function initializeState() {
		if (gameState.value.solution === SOLUTION_PLACEHOLDER) {
			setSolution(await generateWordle());
		}
	}

	function persistGuess(
		evaluation: RevealedState[],
		guess: string,
		rowIndex: number,
	) {
		const { results, guesses, ...rest } = deepClone(gameState.value);
		results.splice(rowIndex, 1, evaluation);
		guesses.splice(rowIndex, 1, guess);

		gameState.value = {
			guesses,
			results,
			...rest,
		};
	}

	return {
		gameState,
		setSolution,
		initializeState,
		persistGuess,
	};
}

type GameState = {
	guesses: string[];
	results: RevealedState[][];
	/** The generated solution word, so it
	 *  persists through page refreshes.
	 *
	 *  @remark The value is obfuscated when serialized to
	 *   discourage cheating, not that it matters really. */
	solution: string;
};

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
