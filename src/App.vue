<script lang="ts">
	import { defineComponent } from "vue";
	import WordleGame from "@/views/WordleGame.vue";

	export default defineComponent({
		name: "App",
		components: {
			WordleGame,
		},
	});
</script>

<template>
	<WordleGame />
</template>
