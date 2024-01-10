import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { GameMode } from "@/models/enums/GameMode";
import WordleGame from "@/views/WordleGame.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: () => ({
			name: GameMode.WORDLE_DAILY,
		}),
	},
	{
		path: "/daily",
		name: GameMode.WORDLE_DAILY,
		component: WordleGame,
	},
	{
		path: "/challenge/:solution",
		name: GameMode.WORDLE_CHALLENGE,
		component: WordleGame,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
