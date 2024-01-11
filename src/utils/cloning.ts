import rfdc from "rfdc";

/** Creates a deep clone of a data object.
 * @remark This will truncate any function values */
export function deepClone<T extends Record<string | number | symbol, any>>(
	object: T,
): T {
	return rfdc()(object);
}
