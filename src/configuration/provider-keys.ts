import { InjectionKey } from "vue";

export const HARD_MODE_ENABLED = Symbol(
	"hardModeEnabled",
) as InjectionKey<boolean>;
export const DO_FAST_FLIP = Symbol("doFastFlip") as InjectionKey<boolean>;
