import { BemModifiers } from "./types";

export function pascalToKebabCase(text: string): string {
	return text
		.replace(/([A-Za-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}

export function resolveDefaultBlock(name: string, hyphenate?: boolean): string {
	return hyphenate ? pascalToKebabCase(name) : name;
}

export function buildElementClass(b: string, e?: string): string {
	return `${b}${e ? `__${e}` : ""}`;
}

/** Filters the class modifiers when necessary, then formats them into a string array. */
function resolveModifiers(modifiers: BemModifiers | undefined): string[] {
	if (!modifiers) {
		return [];
	} else if (typeof modifiers === "string") {
		return [modifiers];
	} else if (Array.isArray(modifiers)) {
		return modifiers;
	} else {
		return Object.entries(modifiers).reduce<string[]>(
			(acc, [modifier, include]) => {
				return include ? acc.concat(modifier) : acc;
			},
			[],
		);
	}
}

export function buildModifierClassList(
	elementClass: string,
	modifiers: BemModifiers | undefined,
) {
	return resolveModifiers(modifiers).map(mod => `${elementClass}--${mod}`);
}
