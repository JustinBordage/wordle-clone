import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import App from "@/App.vue";
import "@/styles/prime-vue/theme.scss";
import "@/styles/common.scss";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
);

createApp(App)
	.use(createPinia())
	.use(PrimeVue, {
		pt: {
			chip: {
				removeIcon: {
					role: "button",
				},
			},
		},
	})
	.mount("#app");


