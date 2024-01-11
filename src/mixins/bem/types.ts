export interface BemOptions {
	hyphenate?: boolean;
}

export type BemModifiers = string | string[] | Record<string, boolean>;

export interface BemItem {
	b?: string;
	e?: string;
	m?: BemModifiers;
}

export type BemHelper = (item?: BemItem) => string[];
