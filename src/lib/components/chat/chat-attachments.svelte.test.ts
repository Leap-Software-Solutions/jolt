import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatAttachments from './chat-attachments.svelte';

test('renders attachment metadata and remove controls', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatAttachments, {
		target,
		props: {
			removable: true,
			attachments: [{ id: '1', name: 'notes.txt', size: 2048, type: 'text/plain' }],
		},
	});

	expect(target.querySelector('[data-slot="attachment"]')?.textContent).toContain('notes.txt');
	expect(target.querySelector('[data-slot="attachment"]')?.textContent).toContain('2 KB');
	expect(
		target.querySelector('button[aria-label^="Remove attachment"]')?.getAttribute('aria-label'),
	).toBe('Remove attachment: notes.txt');

	unmount(app);
	target.remove();
});

test('opens an image attachment in the lightbox', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatAttachments, {
		target,
		props: {
			attachments: [
				{
					id: 'image',
					name: 'architecture.png',
					type: 'image/png',
					href: 'https://example.com/architecture.png',
				},
			],
		},
	});

	const preview = target.querySelector<HTMLButtonElement>('[data-slot="attachment-preview"]');

	expect(preview).not.toBeNull();

	await userEvent.click(preview!);
	await tick();

	const lightbox = document.querySelector('[data-slot="lightbox"]');
	expect(lightbox).not.toBeNull();
	expect(lightbox?.textContent).toContain('1 / 1');
	expect(
		document.querySelector<HTMLImageElement>('[data-slot="lightbox-image"]')?.getAttribute('src'),
	).toBe('https://example.com/architecture.png');

	unmount(app);
	target.remove();
});

test('opens text and unsupported previews from the whole attachment chip', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatAttachments, {
		target,
		props: {
			attachments: [
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
			],
		},
	});
	await tick();

	expect(target.querySelector('a')).toBeNull();

	await userEvent.click(
		target.querySelector<HTMLButtonElement>('[aria-label="Preview release-notes.md"]')!,
	);
	await tick();

	expect(document.querySelector('[data-slot="lightbox-text"]')?.textContent).toContain(
		'Release notes',
	);
	expect(
		document.querySelector<HTMLAnchorElement>('[aria-label="Download release-notes.md"]')?.href,
	).toBe('https://example.com/release-notes.md');

	await userEvent.click(document.querySelector<HTMLButtonElement>('[aria-label="Close preview"]')!);
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
