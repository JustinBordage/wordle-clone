import { useRoute, useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { useGameMode } from "@/composables/useGameMode";
import { WORDLE_LENGTH } from "@/configuration/magic-numbers";
import { generateWordle } from "@/helpers/wordle";
import {
	deobfuscateSolution,
	obfuscateSolution,
} from "@/helpers/wordle-obfuscation";
import { GameMode } from "@/models/enums/GameMode";
import { RevealedState } from "@/models/enums/GameTileState";
import { deepClone } from "@/utils/cloning";

/** This is for when the solution hasn't yet been generated. Since the
 *  words list needs to be pulled with an asynchronous http request.
 *
 *  The length should be the same length as the generated Wordle. */
const SOLUTION_PLACEHOLDER = "_".repeat(WORDLE_LENGTH);

export default function useGameState() {
	const router = useRouter();
	const gameMode = useGameMode();

	const gameState = useLocalStorage(
		"gameState",
		() => ({
			guesses: [],
			results: [],
			solution: SOLUTION_PLACEHOLDER,
			gameMode: gameMode.value,
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

	async function resetProgress(
		gameMode: GameMode,
		solution: string | Promise<string> = generateWordle(gameMode),
	) {
		const newSolution: string = await solution;
		gameState.value = {
			guesses: [],
			results: [],
			solution: newSolution.toUpperCase(),
			gameMode,
		};

		await router.replace({
			name: gameMode,
			params:
				gameMode === GameMode.WORDLE_CHALLENGE
					? { solution: obfuscateSolution(newSolution) }
					: undefined,
		});
	}

	async function initializeState() {
		const currGameMode = gameMode.value;
		const { solution, gameMode: savedGameMode } = gameState.value;

		if (currGameMode !== GameMode.WORDLE_CHALLENGE) {
			if (
				solution === SOLUTION_PLACEHOLDER ||
				savedGameMode !== currGameMode
			) {
				await resetProgress(currGameMode);
			}
		} else {
			try {
				const challengeSolution = getChallengeSolution();
				if (solution !== challengeSolution) {
					await resetProgress(
						GameMode.WORDLE_CHALLENGE,
						challengeSolution,
					);
				}
			} catch (e) {
				await resetProgress(GameMode.WORDLE_DAILY);
			}
		}
	}

	function persistGuess(
		evaluation: RevealedState[],
		guess: string,
		rowIndex: number,
	) {
		const { results, guesses, ...rest } = deepClone(gameState.value);
		guesses.splice(rowIndex, 1, guess.toUpperCase());
		results.splice(rowIndex, 1, evaluation);

		gameState.value = {
			guesses,
			results,
			...rest,
		};
	}

	return {
		gameState,
		resetProgress,
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
	gameMode: GameMode;
};

function getChallengeSolution() {
	const solutionParam = useRoute().params.solution;
	const rawSolution = Array.isArray(solutionParam)
		? solutionParam[0]
		: solutionParam;

	return deobfuscateSolution(rawSolution);
}
