/**
 * Splits pasted text into tags on the configured separator characters.
 *
 * Newlines are always treated as separators, even when the caller omits them.
 */
export function splitTags(value: string, separators: string[]): string[] {
	const separatorSet = new Set([...separators, '\n', '\r']);
	const parts: string[] = [];
	let current = '';

	for (const character of value) {
		if (!separatorSet.has(character)) {
			current += character;
			continue;
		}

		const next = current.trim();
		if (next) parts.push(next);
		current = '';
	}

	const next = current.trim();
	if (next) parts.push(next);

	return parts;
}
