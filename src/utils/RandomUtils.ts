// Min is inclusive, Max is exclusive
export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}