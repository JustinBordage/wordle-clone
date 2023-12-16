import { ref } from "vue";

/** Observes if a specific key is
 *  being held down by the end-user. */
export default function useKeyHold(targetKey: string) {
	const isHeld = ref(false);

	const onHold = (event: KeyboardEvent) => {
		if (isHeld.value || event.key !== targetKey) return;
		isHeld.value = true;
	};

	const onRelease = (event: KeyboardEvent) => {
		if (event.key !== targetKey) return;
		isHeld.value = false;
	};

	document.addEventListener("keydown", onHold);
	document.addEventListener("keyup", onRelease);

	function stop() {
		document.removeEventListener("keydown", onHold);
		document.removeEventListener("keyup", onRelease);
	}

	return {
		isHeld,
		stop,
	};
}