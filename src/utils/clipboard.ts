export function copyToClipboard(textToCopy: string) {
	navigator.clipboard.writeText(textToCopy);
}
