async function getFileAsText(uri: string) {
	const resp = await fetch(uri, {
		method: "GET",
	});

	return resp.ok ? await resp.text() : null;
}

type DictionaryFiles = {
	words: string;
	affix: string;
};

export async function getDictionaryFiles(
	language: string = "en",
): Promise<DictionaryFiles | null> {
	const files = await Promise.all([
		getFileAsText(`/api/dictionaries/${language}.aff`),
		getFileAsText(`/api/dictionaries/${language}.dic`),
	])
		.then(([affix, words]): DictionaryFiles | null => {
			if (affix === null || words === null) {
				return null;
			}

			return {
				words,
				affix,
			};
		})
		.catch((): null => null);

	if (files === null) {
		console.error("Dictionary does not exist!");
		return null;
	}

	return files;
}
