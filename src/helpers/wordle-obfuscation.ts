import { b64Decode, b64Encode } from "@/utils/base64";
import { reverse } from "@/utils/string";

/** Obfuscates the solution by encoding it
 *  in an unpadded base 64 format, reversing
 *  the result and then encoding in b64 again.
 *
 *  @remark This is NOT encryption, nor does it have to be! */
export function obfuscateSolution(solution: string): string {
	let obfuscatedWord = b64Encode(solution, true);
	obfuscatedWord = reverse(obfuscatedWord);
	return b64Encode(obfuscatedWord, true);
}

/** De-obfuscates the solution */
export function deobfuscateSolution(obfuscatedSolution: string): string {
	let deobfuscatedWord = b64Decode(obfuscatedSolution);
	deobfuscatedWord = reverse(deobfuscatedWord);
	return b64Decode(deobfuscatedWord);
}
