import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import AttachmentList from './attachment-list.svelte';
import type { AttachmentItem } from './types.js';

const attachments: AttachmentItem[] = [
	{
		id: 'notes',
		name: 'release-notes.md',
		type: 'text/markdown',
		content: '# Release notes\n\nReady to preview.',
		href: 'https://example.com/release-notes.md',
	},
	{
		id: 'archive',
		name: 'design-assets.zip',
		type: 'application/zip',
		href: 'https://example.com/design-assets.zip',
	},
];

test('opens a text preview from the whole chip and exposes tabs and download', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(AttachmentList, { target, props: { attachments } });
	await tick();

	expect(target.querySelector('a')).toBeNull();
	await userEvent.click(
		target.querySelector<HTMLButtonElement>('[aria-label="Preview release-notes.md"]')!,
	);
	await tick();

	const text = document.querySelector('[data-slot="lightbox-text"]');
	expect(text?.textContent).toContain('Release notes');
	expect(
		document.querySelector<HTMLAnchorElement>('[aria-label="Download release-notes.md"]')?.href,
	).toBe('https://example.com/release-notes.md');

	await userEvent.click(document.querySelector<HTMLButtonElement>('[role="tab"]:last-child')!);
	await tick();

	expect(document.querySelector('[data-slot="lightbox-code"]')?.textContent).toContain(
		'# Release notes',
	);

	unmount(app);
	target.remove();
});

test('opens a fallback for an unsupported file', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(AttachmentList, { target, props: { attachments } });
	await tick();

	await userEvent.click(
		target.querySelector<HTMLButtonElement>('[aria-label="Preview design-assets.zip"]')!,
	);
	await tick();

	expect(document.querySelector('[data-slot="lightbox-file"]')?.textContent).toContain(
		"This file can't be previewed.",
	);
	expect(
		document.querySelector<HTMLAnchorElement>('[aria-label="Download design-assets.zip"]')?.href,
	).toBe('https://example.com/design-assets.zip');

	unmount(app);
	target.remove();
});
