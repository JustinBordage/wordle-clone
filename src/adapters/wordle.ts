/** Fetches a list of valid words from the backend
 *  based on the length of the solution word.
 *
 *  @remark I'm emulating a backend by placing
 *   the files within the "public" directory. */
export async function getWordsList(wordLength: number): Promise<string[]> {
	const resp = await fetch(`/api/words/${wordLength}.json`, {
		method: "GET",
	});

	return resp.ok ? await resp.json() : [];
}

/** @disclaimer While it would probably be better to just import
 *   the word lists, I've chosen to emulate a http request to show
 *   how I might implement such a request in a project without a
 *   npm package like axios. */
