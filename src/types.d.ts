/// <reference types="@vue/runtime-core" />

import type { InjectionKey, MaybeRef } from "vue";

declare module "@vue/runtime-core" {
	export declare function provide<T, K = InjectionKey<T> | string | number>(
		key: K,
		value: K extends InjectionKey<infer V> ? MaybeRef<V> : T,
	): void;
}
