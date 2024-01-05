/** Reverses a string. */
export function reverse(value: string): string {
	return Array.from(value).reverse().join("");
}

/** Checks if a string is empty
 *
 * @rule undefined -> true
 * @rule null -> true */
export function isEmpty(
	strVal: string | null | undefined,
): strVal is null | undefined | "" {
	return (strVal ?? "").length === 0;
}

/** Checks if a string is blank (whitespace only) or empty
 *
 * @rule undefined -> true
 * @rule null -> true */
export function isBlank(
	strVal: string | null | undefined,
): strVal is null | undefined {
	return isEmpty(strVal?.trim());
}

/** Checks if a string is NOT blank (whitespace only) and NOT empty
 *
 * @rule undefined -> false
 * @rule null -> false */
export function isNotBlank(
	strVal: string | null | undefined,
): strVal is string {
	return !isBlank(strVal);
}
