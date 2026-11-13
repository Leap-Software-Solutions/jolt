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

	expect(target.querySelector('[data-slot="chat-attachment"]')?.textContent).toContain('notes.txt');
	expect(target.querySelector('[data-slot="chat-attachment"]')?.textContent).toContain('2 KB');
	expect(target.querySelector('button')?.getAttribute('aria-label')).toBe(
		'Remove attachment: notes.txt',
	);

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

	const preview = target.querySelector<HTMLButtonElement>('[data-slot="chat-attachment-preview"]');

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
