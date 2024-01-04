<script lang="ts">
	import { defineComponent } from "vue";
	import WordleGame from "@/views/WordleGame.vue";

	export default defineComponent({
		name: "App",
		components: {
			WordleGame,
		},
		mounted() {
			this.$primevue.config.ripple = true;
		},
	});
</script>

<template>
	<div class="nightmode">
		<WordleGame />
	</div>
</template>
