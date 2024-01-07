import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Ripple from "primevue/ripple";
import { createPinia } from "pinia";
import App from "@/App.vue";
import "@/styles/prime-vue/inputswitch.scss";
import "@/styles/common.scss";
import { createBem } from "@/mixins/bem";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	ChartDataLabels,
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
		ripple: true,
	})
	.directive("ripple", Ripple)
	.use(
		createBem({
			hyphenate: true,
		}),
	)
	.mount("#app");
