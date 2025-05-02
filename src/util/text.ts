/**
 * Capitalizes all words in a string
 * @author jplacht
 *
 * @export
 * @param {string} text Some test
 * @returns {string} Capitalized words
 */
export function capitalizeString(text: string): string {
	let transformedText: string =
		text[0].toUpperCase() + text.slice(1).toLocaleLowerCase();

	const words: string[] = transformedText.split(" ");
	if (words.length > 0) {
		for (let i = 0; i < words.length; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substring(1);
		}

		transformedText = words.join(" ");
	}

	return transformedText;
}
