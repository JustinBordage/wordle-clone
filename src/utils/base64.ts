export function b64Encode(value: string, noPad: boolean = false): string {
	const b64Value = btoa(value);
	return noPad ? b64Value.replace(/=+$/, "") : b64Value;
}

export function b64Decode(b64Value: string): string {
	const targetLength = b64Value.length + ((4 - (b64Value.length % 4)) % 4);
	const paddedB64Value = b64Value.padEnd(targetLength, "=");
	return atob(paddedB64Value);
}
