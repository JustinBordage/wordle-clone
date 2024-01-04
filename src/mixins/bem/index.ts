import { App } from "vue";
import {
	buildElementClass,
	buildModifierClassList,
	resolveDefaultBlock,
} from "./helpers";
import { BemHelper, BemItem, BemOptions } from "./types";

// ====================
//      Base Logic
// ====================

function bem(
	block: string,
	element?: string,
	modifiers?: string | string[] | Record<string, boolean>,
) {
	const elementClass = buildElementClass(block, element);
	const modifiersClasses = buildModifierClassList(elementClass, modifiers);
	return [elementClass, ...modifiersClasses];
}

// =====================
//     Configuration
// =====================

const DEFAULT_BEM_OPTIONS: BemOptions = {
	hyphenate: true,
};

function configureBem(options: BemOptions = {}) {
	try {
		Object.entries(options).forEach(([key, value]) => {
			DEFAULT_BEM_OPTIONS[key] = value;
		});
	} catch (e) {
		console.warn(
			"Detected attempt to override the BEM configuration after it has already been configured!",
		);
	}
	Object.freeze(DEFAULT_BEM_OPTIONS);
}

// =====================
//      Composables
// =====================

/** A composable for generating the BEM classes
 *  for an element in the Vue template. */
export function useBem(
	block: string,
	{ hyphenate }: BemOptions = DEFAULT_BEM_OPTIONS,
): BemHelper {
	const defBlock = resolveDefaultBlock(block, hyphenate);
	return ({ b, e, m }: BemItem = {}) => bem(b ?? defBlock, e, m);
}

// ====================
//    Initialization
// ====================

/** Applies the default global configuration for the
 *  BEM Helper and returns a Vue Component Mixin. */
export function createBem(options: BemOptions = {}) {
	configureBem(options);

	function install(Vue: App, options: BemOptions = {}): void {
		Vue.mixin({
			name: "BemMixin",
			computed: {
				$bem(): BemHelper {
					return useBem(this.$options.name, options);
				},
			},
		});
	}

	return { install: (Vue: App) => install(Vue, options) };
}
