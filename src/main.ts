import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import App from "@/App.vue";
import "@/styles/prime-vue/theme.scss";
import "@/styles/common.scss";

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

