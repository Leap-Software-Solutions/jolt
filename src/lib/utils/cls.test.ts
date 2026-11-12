import { describe, expect, test } from 'vitest';
import { cls } from './cls.js';

describe('cls', () => {
	test('merges conflicting tailwind utilities', () => {
		expect(cls('px-2', 'px-4')).toBe('px-4');
	});

	test('drops falsy values', () => {
		expect(cls('px-2', false, undefined, null)).toBe('px-2');
	});
});
