import { computed, ComputedRef } from "vue";
import { useRoute } from "vue-router";
import { GameMode } from "@/models/enums/GameMode";

export function useGameMode(): ComputedRef<GameMode> {
	const route = useRoute();

	return computed(() => {
		switch (route.name) {
			case GameMode.WORDLE_CHALLENGE:
				return GameMode.WORDLE_CHALLENGE;
			case GameMode.WORDLE_DAILY:
			default:
				return GameMode.WORDLE_DAILY;
		}
	});
}
