// Min is inclusive, Max is exclusive
export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function pickRandomWord(wordList: string[]) {
	return wordList[randomInt(0, wordList.length)];
}
