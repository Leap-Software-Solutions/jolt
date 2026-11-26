const TAG_PATTERN = /<\/?[a-zA-Z][^>]*>/g;

function getTagName(tag: string): string {
	const match = /^<\/?([a-zA-Z][\w:-]*)/.exec(tag);
	return match?.[1] ?? '';
}

function closeTags(tags: string[]): string {
	return tags
		.slice()
		.reverse()
		.map((tag) => `</${getTagName(tag)}>`)
		.join('');
}

/**
 * Splits highlight.js output into balanced HTML lines.
 *
 * Highlight spans can cross source newlines (block comments, template
 * strings). Each line closes the spans it inherited and reopens them on the
 * next line so lines can be rendered as independent elements.
 */
export function splitHighlightedLines(html: string): string[] {
	const lines: string[] = [];
	const openTags: string[] = [];
	let currentLine = '';

	function appendText(text: string): void {
		const segments = text.split('\n');
		segments.forEach((segment, index) => {
			if (index > 0) {
				currentLine += closeTags(openTags);
				lines.push(currentLine);
				currentLine = openTags.join('');
			}
			currentLine += segment;
		});
	}

	let lastIndex = 0;
	for (const match of html.matchAll(TAG_PATTERN)) {
		appendText(html.slice(lastIndex, match.index));
		const tag = match[0];
		const name = getTagName(tag);

		if (tag.startsWith('</')) {
			let openIndex = -1;
			for (let index = openTags.length - 1; index >= 0; index -= 1) {
				if (getTagName(openTags[index]!) === name) {
					openIndex = index;
					break;
				}
			}
			if (openIndex >= 0) openTags.splice(openIndex, 1);
			currentLine += tag;
		} else {
			if (!tag.endsWith('/>')) openTags.push(tag);
			currentLine += tag;
		}

		lastIndex = match.index + tag.length;
	}

	appendText(html.slice(lastIndex));
	lines.push(currentLine);

	return lines;
}
