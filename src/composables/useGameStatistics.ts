import type { Ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import GameStatus, { type GameOutcome } from "@/models/enums/GameStatus";

export default function useGameStatistics(
	withControls?: false,
): Ref<GameStatistics>;
export default function useGameStatistics(
	withControls: true,
): GameStatisticsWithControls;
export default function useGameStatistics(
	withControls: boolean = false,
): Ref<GameStatistics> | GameStatisticsWithControls {
	const statistics = useLocalStorage(
		"statistics",
		initialGameStatisticsSupplier,
	);

	if (!withControls) {
		return statistics;
	} else {
		function saveGameResults(outcome: GameOutcome, rowIndex: number) {
			const guessDistribution = { ...statistics.value.guessDistribution };
			let { gamesPlayed, gamesLost, winStreak, highestWinStreak } =
				statistics.value;

			gamesPlayed++;
			if (outcome === GameStatus.WIN) {
				guessDistribution[`${rowIndex}`] ??= 0;
				guessDistribution[`${rowIndex}`]++;
				winStreak++;
			} else {
				gamesLost++;
				winStreak = 0;
			}

			if (winStreak > highestWinStreak) {
				highestWinStreak = winStreak;
			}

			statistics.value = {
				gamesPlayed,
				gamesLost,
				winStreak,
				highestWinStreak,
				guessDistribution,
			};
		}

		function resetStatistics() {
			statistics.value = initialGameStatisticsSupplier();
		}

		return {
			statistics,
			saveGameResults,
			resetStatistics,
		};
	}
}

function initialGameStatisticsSupplier(): GameStatistics {
	return {
		gamesPlayed: 0,
		gamesLost: 0,
		winStreak: 0,
		highestWinStreak: 0,
		guessDistribution: {},
	};
}

export type GameStatistics = {
	gamesPlayed: number;
	gamesLost: number;
	winStreak: number;
	highestWinStreak: number;
	guessDistribution: Record<`${number}`, number>;
};

interface GameStatisticsWithControls {
	statistics: Ref<GameStatistics>;
	saveGameResults: (outcome: GameOutcome, rowIndex: number) => void;
	resetStatistics: Function;
}
