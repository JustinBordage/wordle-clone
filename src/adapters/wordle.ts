export async function getWordsList(wordLength: number): Promise<string[]> {
	const resp = await fetch(`/api/words/${wordLength}.json`, {
		method: "GET",
	});

	return resp.ok ? await resp.json() : [];
}