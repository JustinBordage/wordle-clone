import MersenneTwister from "mersenne-twister";

export function useMersenneTwister(seed?: number): RandomMT {
	const generator = new MersenneTwister(seed);

	function randomInt(min: number, max: number) {
		return Math.floor(generator.random() * (max - min) + min);
	}

	return {
		random: () => generator.random(),
		randomInt,
	};
}

type RandomMT = {
	/** Generates a random number on [0,1] real interval.
	 * @remark This is the same interval as `Math.random` */
	random(): number;
	/** Generates a random integer between `min`
	 *  (Inclusive) and `max` (Exclusive). */
	randomInt(min: number, max: number): number;
};
