import { BemItem } from "./types";

declare module "@vue/runtime-core" {
	// noinspection JSUnusedGlobalSymbols
	interface ComponentCustomProperties {
		$bem: (T: BemItem) => string[];
	}
}
