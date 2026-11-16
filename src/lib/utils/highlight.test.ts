import { expect, test } from 'vitest';
import { highlightCode } from './highlight.js';

test('highlights registered source languages', () => {
	expect(highlightCode('fn main() { let answer = 42; }', 'rust')).toContain('hljs-keyword');
	expect(highlightCode('accent: "#bba53d"', 'yaml')).toContain('hljs-attr');
});
