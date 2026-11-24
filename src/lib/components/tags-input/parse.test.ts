import { expect, test } from 'vitest';
import { splitTags } from './parse.js';

test('splits pasted tags on configured separators and newlines', () => {
	expect(splitTags('retro, action-item; follow-up\nnext', [',', ';'])).toEqual([
		'retro',
		'action-item',
		'follow-up',
		'next',
	]);
});

test('keeps a single value intact for normal paste handling', () => {
	expect(splitTags('one tag', [',', ';'])).toEqual(['one tag']);
});
