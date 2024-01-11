import { DeepReadonly, Ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import GameStatus from "@/models/enums/GameStatus";
import type { GameOutcome } from "@/models/enums/GameStatus";
import { useMessageStore } from "@/stores/message";

export const useStatisticsStore = defineStore("statistics", () => {
	const messageStore = useMessageStore();

	const statistics = useLocalStorage("statistics", supplyStatistics);

	function saveGameResults(outcome: GameOutcome, numOfGuesses: number) {
		const guessDistribution = { ...statistics.value.guessDistribution };
		let { gamesPlayed, gamesLost, winStreak, highestWinStreak } =
			statistics.value;

		gamesPlayed++;
		if (outcome === GameStatus.WIN) {
			messageStore.showWinMessage(numOfGuesses);

			guessDistribution[`${numOfGuesses}`] ??= 0;
			guessDistribution[`${numOfGuesses}`]++;
			winStreak++;

			if (winStreak > highestWinStreak) {
				highestWinStreak = winStreak;
			}
		} else {
			gamesLost++;
			winStreak = 0;
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
		statistics.value = supplyStatistics();
	}

	return {
		statistics: statistics as Ref<DeepReadonly<GameStatistics>>,
		saveGameResults,
		resetStatistics,
	};
});

function supplyStatistics(): GameStatistics {
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
