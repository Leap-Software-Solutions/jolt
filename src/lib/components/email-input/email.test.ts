import { expect, test } from 'vitest';
import { isEmail, normalizeEmail } from './email.js';

test('accepts pragmatic email addresses and rejects incomplete ones', () => {
	expect(isEmail('ada@example.com')).toBe(true);
	expect(isEmail('ada@example')).toBe(false);
	expect(isEmail('ada example.com')).toBe(false);
});

test('trims and lowercases addresses for storage', () => {
	expect(normalizeEmail('  ADA@Example.COM  ')).toBe('ada@example.com');
});
