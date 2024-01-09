import { Ref, watch } from "vue";
import { RefOrGetter } from "@/models/types/vue";

/** Applies a "shake" class to an
 *  element when the boolean is true.
 *
 *  @remark Requires a shake animation
 *  to be tied to the ".shake" selector. */
export function useShakeElement(
	elementRef: Ref<HTMLElement | null>,
	isShaking: RefOrGetter<boolean>,
) {
	watch(
		isShaking,
		shaking => {
			const element = elementRef.value;
			element?.classList.toggle("shake", shaking);
		},
		{ immediate: true },
	);
}
