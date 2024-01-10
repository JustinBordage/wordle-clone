<script lang="ts">
	import { defineComponent } from "vue";
	import useColorBlindTheme from "@/composables/settings/useColorBlindTheme";
	import useDarkTheme from "@/composables/settings/useDarkTheme";

	export default defineComponent({
		name: "App",
		computed: {
			themeClasses() {
				const themes: string[] = [];

				if (this.isDarkThemeEnabled) {
					themes.push("nightmode");
				}

				if (this.isColorBlindThemeEnabled) {
					themes.push("colorblind");
				}

				return themes;
			},
		},
		watch: {
			isDarkThemeEnabled: {
				handler() {
					const theme = this.isDarkThemeEnabled
						? "lara-dark-green"
						: "lara-light-green";

					document
						.getElementById("theme-link")
						?.setAttribute("href", `/themes/${theme}.css`);
				},
				immediate: true,
			},
		},
		setup: () => ({
			isDarkThemeEnabled: useDarkTheme(),
			isColorBlindThemeEnabled: useColorBlindTheme(),
		}),
		mounted() {
			this.$primevue.config.ripple = true;
		},
	});
</script>

<template>
	<div :class="themeClasses">
		<router-view />
	</div>
</template>
