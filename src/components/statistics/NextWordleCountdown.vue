<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { useTimestamp } from "@vueuse/core";
	import {
		MS_PER_HOUR,
		MS_PER_MINUTE,
		MS_PER_SECOND,
	} from "@/models/magic-numbers/time";
	import { getUtcOffsetMs, tomorrow } from "@/utils/date";
	import { padNumberStart } from "@/utils/string";

	defineOptions({ name: "NextWordleCountdown" });

	const resetDatetime = ref(tomorrow().getTime());

	const { pause, resume, timestamp } = useTimestamp({
		controls: true,
		interval: MS_PER_SECOND,
		offset: getUtcOffsetMs() * -1,
		immediate: true,
	});

	const timeToNextWordle = computed(() =>
		Math.max(resetDatetime.value - timestamp.value, 0),
	);

	const prettyTimeToNextWordle = computed(() => {
		const hours = Math.floor(timeToNextWordle.value / MS_PER_HOUR);
		let remainder = timeToNextWordle.value % MS_PER_HOUR;

		const minutes = Math.floor(remainder / MS_PER_MINUTE);
		remainder %= MS_PER_MINUTE;

		const seconds = Math.floor(remainder / MS_PER_SECOND);

		return `${padNumberStart(hours, 2)}:${padNumberStart(
			minutes,
			2,
		)}:${padNumberStart(seconds, 2)}`;
	});

	watch(
		() => timeToNextWordle.value === 0,
		doPauseTimer => {
			if (doPauseTimer) {
				pause();
			} else {
				resume();
			}
		},
		{ immediate: true },
	);
</script>

<template>
	<div :class="$bem({})">
		<p :class="$bem({ e: 'title' })">Next Wordle</p>
		<label :class="$bem({ e: 'time' })">{{ prettyTimeToNextWordle }}</label>
	</div>
</template>

<style lang="scss">
	.next-wordle-countdown {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: var(--color-tone-1);

		margin-right: 0.75rem;
		padding-right: 0.75rem;
		border-right: 0.0625rem solid var(--color-tone-1);

		&__title {
			margin-block: 0.625rem;
			letter-spacing: 0.0625rem;
			text-transform: uppercase;
			text-align: center;
		}

		&__time {
			font-size: 2.25rem;
			line-height: 1.2;
		}
	}
</style>
