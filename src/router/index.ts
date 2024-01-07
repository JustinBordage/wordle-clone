import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import WordleGame from "@/views/WordleGame.vue";
import { View } from "@/router/views";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: () => ({
			name: View.WORDLE_DAILY,
		}),
	},
	{
		path: "/daily",
		name: View.WORDLE_DAILY,
		component: WordleGame,
	},
	{
		path: "/challenge/:solution",
		name: View.WORDLE_CHALLENGE,
		component: WordleGame,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
