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

/** Converts a number to a string and then calls `padStart`. */
export function padNumberStart(
	num: number,
	maxLength: number,
	fillString: string = "0",
) {
	return num.toString().padStart(maxLength, fillString);
}

/** Evaluates the ordinal suffix of a number. */
export function ordinalOf(num: number): string {
	// Ordinal for teens (11 to 19)
	if ((num / 10) % 10 == 1) {
		return "th";
	}

	// Suffix for 'Ones'
	switch (num % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

/** Evaluates the ordinal suffix of a number
 *  and then appends it behind the number. */
export function appendOrdinal(num: number): string {
	return `${num}${ordinalOf(num)}`;
}
