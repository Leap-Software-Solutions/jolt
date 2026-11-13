import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import Lightbox from './lightbox.svelte';
import type { LightboxImage, LightboxItem } from './types.js';

const images: LightboxImage[] = [
	{
		kind: 'image',
		src: 'https://example.com/one.jpg',
		alt: 'First image',
		caption: 'First caption',
	},
	{
		kind: 'image',
		src: 'https://example.com/two.jpg',
		alt: 'Second image',
		caption: 'Second caption',
	},
];

test('navigates images and closes the lightbox', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(Lightbox, {
		target,
		props: { items: images, open: true },
	});
	await tick();

	const dialog = document.querySelector('[data-slot="lightbox"]');
	const firstImage = document.querySelector<HTMLImageElement>('[data-slot="lightbox-image"]');

	expect(dialog).not.toBeNull();
	expect(firstImage?.getAttribute('alt')).toBe('First image');
	expect(dialog?.textContent).toContain('1 / 2');
	expect(dialog?.textContent).toContain('First caption');

	await userEvent.click(document.querySelector<HTMLButtonElement>('[aria-label="Next item"]')!);
	await tick();

	expect(
		document.querySelector<HTMLImageElement>('[data-slot="lightbox-image"]')?.getAttribute('alt'),
	).toBe('Second image');
	expect(dialog?.textContent).toContain('2 / 2');

	await userEvent.keyboard('{ArrowLeft}');
	await tick();

	expect(
		document.querySelector<HTMLImageElement>('[data-slot="lightbox-image"]')?.getAttribute('alt'),
	).toBe('First image');

	await userEvent.click(document.querySelector<HTMLButtonElement>('[aria-label="Close preview"]')!);
	await tick();

	expect(document.querySelector('[data-slot="lightbox"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('switches Markdown preview and code, and opens a download URL', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const items: LightboxItem[] = [
		{
			kind: 'text',
			title: 'notes.md',
			format: 'markdown',
			content: '# Hello\n\nFrom the preview.',
			downloadUrl: 'https://example.com/notes.md',
		},
	];
	const app = mount(Lightbox, { target, props: { items, open: true } });
	await tick();

	const text = document.querySelector('[data-slot="lightbox-text"]');
	expect(text?.querySelector('h1')?.textContent).toBe('Hello');
	expect(document.querySelector('[data-slot="lightbox-tabs"] [role="tab"]')).not.toBeNull();
	expect(text?.querySelector('[role="tab"]')).toBeNull();
	expect(document.querySelector<HTMLAnchorElement>('[aria-label="Download notes.md"]')?.href).toBe(
		'https://example.com/notes.md',
	);

	await userEvent.click(document.querySelector<HTMLButtonElement>('[role="tab"]:last-child')!);
	await tick();

	expect(document.querySelector('[data-slot="lightbox-code"]')?.textContent).toContain('# Hello');
	expect(
		document.querySelector('[data-slot="lightbox-code"] [data-slot="code-block"]'),
	).not.toBeNull();
	expect(
		document
			.querySelector('[data-slot="lightbox-tabs"] [role="tab"][aria-selected="true"]')
			?.textContent?.trim(),
	).toBe('Code');

	unmount(app);
	target.remove();
});

test('renders plain text without tabs', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const items: LightboxItem[] = [
		{ kind: 'text', title: 'notes.txt', format: 'text', content: 'Plain text over\nlines.' },
	];
	const app = mount(Lightbox, { target, props: { items, open: true } });
	await tick();

	expect(document.querySelector('[data-slot="lightbox-text-title"]')?.textContent?.trim()).toBe(
		'notes.txt',
	);
	expect(document.querySelector('[data-slot="lightbox-text-surface"]')?.textContent).not.toContain(
		'notes.txt',
	);
	expect(document.querySelector('[data-slot="lightbox-tabs"] [role="tab"]')).toBeNull();
	expect(document.querySelector('[data-slot="lightbox-text-content"]')?.textContent).toContain(
		'Plain text over',
	);
	expect(document.querySelector('[aria-label^="Download notes.txt"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('shows a download action for an unsupported file', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const items: LightboxItem[] = [
		{
			kind: 'file',
			name: 'design-assets.zip',
			mimeType: 'application/zip',
			downloadUrl: 'https://example.com/design-assets.zip',
		},
	];
	const app = mount(Lightbox, { target, props: { items, open: true } });
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
