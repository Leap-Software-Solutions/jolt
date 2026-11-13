import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import FileUpload from './file-upload.svelte';

test('uploads a file and removes it', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(FileUpload, { target });
	const input = target.querySelector<HTMLInputElement>('input[type="file"]');
	const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });

	expect(input).not.toBeNull();
	await userEvent.upload(input!, file);
	await tick();

	expect(target.querySelector('[data-slot="attachment"]')?.textContent).toContain('notes.txt');

	await userEvent.click(
		target.querySelector<HTMLButtonElement>('[aria-label="Remove file: notes.txt"]')!,
	);
	await tick();

	expect(target.querySelector('[data-slot="attachment"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('previews an uploaded image', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(FileUpload, { target });
	const input = target.querySelector<HTMLInputElement>('input[type="file"]');
	const png = Uint8Array.from(
		atob(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
		),
		(character) => character.charCodeAt(0),
	);
	const file = new File([png], 'preview.png', { type: 'image/png' });

	await userEvent.upload(input!, file);
	await tick();
	await tick();

	const preview = target.querySelector<HTMLButtonElement>('[data-slot="attachment-preview"]');
	expect(preview).not.toBeNull();

	await userEvent.click(preview!);
	await tick();

	expect(document.querySelector('[data-slot="lightbox"]')).not.toBeNull();

	unmount(app);
	target.remove();
});

test('previews a selected Markdown file', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(FileUpload, { target });
	const input = target.querySelector<HTMLInputElement>('input[type="file"]');
	const file = new File(['# Notes\n\nReady to preview.'], 'notes.md', { type: 'text/markdown' });

	await userEvent.upload(input!, file);
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 0));

	const preview = target.querySelector<HTMLButtonElement>('[data-slot="attachment-preview"]');
	expect(preview).not.toBeNull();

	await userEvent.click(preview!);
	await tick();

	expect(document.querySelector('[data-slot="lightbox-text"]')?.textContent).toContain('Notes');
	expect(document.querySelector('[role="tab"]')).not.toBeNull();
	expect(document.querySelector('[aria-label^="Download notes.md"]')).not.toBeNull();

	unmount(app);
	target.remove();
});
