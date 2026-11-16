import { expect, test } from 'vitest';
import { getCodeLanguage, hasTextPreview, toLightboxItem } from './preview.js';
import type { AttachmentItem } from './types.js';

function attachment(overrides: Partial<AttachmentItem>): AttachmentItem {
	return { id: 'file', name: 'file', ...overrides };
}

test('detects source languages from extensions, MIME types, and file names', () => {
	expect(getCodeLanguage(attachment({ name: 'main.rs' }))).toBe('rust');
	expect(getCodeLanguage(attachment({ name: 'theme.ts' }))).toBe('typescript');
	expect(getCodeLanguage(attachment({ name: 'Dockerfile' }))).toBe('dockerfile');
	expect(getCodeLanguage(attachment({ name: 'payload', type: 'application/json' }))).toBe('json');
	expect(getCodeLanguage(attachment({ name: 'build.yml' }))).toBe('yaml');
	expect(getCodeLanguage(attachment({ name: 'notes.txt', type: 'text/plain' }))).toBeNull();
});

test('maps source attachments with content to code previews', () => {
	const item = toLightboxItem(
		attachment({
			name: 'main.py',
			type: 'text/plain',
			content: 'answer = 42',
			href: 'https://example.com/main.py',
		}),
	);

	expect(item).toEqual({
		kind: 'code',
		title: 'main.py',
		content: 'answer = 42',
		language: 'python',
		downloadUrl: 'https://example.com/main.py',
	});
});

test('keeps Markdown and plain text in the text preview', () => {
	expect(
		toLightboxItem(
			attachment({
				name: 'notes.md',
				content: '# Notes',
			}),
		),
	).toMatchObject({ kind: 'text', format: 'markdown' });
	expect(
		toLightboxItem(
			attachment({
				name: 'notes.txt',
				content: 'Notes',
			}),
		),
	).toMatchObject({ kind: 'text', format: 'text' });
});

test('reads text and source files but not binary attachments', () => {
	expect(hasTextPreview(attachment({ name: 'notes.txt' }))).toBe(true);
	expect(hasTextPreview(attachment({ name: 'main.ts' }))).toBe(true);
	expect(hasTextPreview(attachment({ name: 'archive.zip', type: 'application/zip' }))).toBe(false);
});
