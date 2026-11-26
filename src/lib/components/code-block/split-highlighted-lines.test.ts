import { expect, test } from 'vitest';
import { splitHighlightedLines } from './split-highlighted-lines.js';

test('splits plain text into lines', () => {
	expect(splitHighlightedLines('')).toEqual(['']);
	expect(splitHighlightedLines('const value = 1;\nreturn value;')).toEqual([
		'const value = 1;',
		'return value;',
	]);
});

test('balances highlight spans across lines', () => {
	expect(splitHighlightedLines('<span class="hljs-comment">first\nsecond</span>')).toEqual([
		'<span class="hljs-comment">first</span>',
		'<span class="hljs-comment">second</span>',
	]);
});

test('reopens nested spans in the correct order', () => {
	expect(
		splitHighlightedLines(
			'<span class="hljs-string"><span class="hljs-subst">first\nsecond</span></span>',
		),
	).toEqual([
		'<span class="hljs-string"><span class="hljs-subst">first</span></span>',
		'<span class="hljs-string"><span class="hljs-subst">second</span></span>',
	]);
});
