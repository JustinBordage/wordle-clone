export async function getWordsList(
	wordLength: number,
	language: string = "en",
): Promise<string[]> {
	const resp = await fetch(`/api/words/${language}/${wordLength}.json`, {
		method: "GET",
	});

	return resp.ok ? await resp.json() : [];
}
