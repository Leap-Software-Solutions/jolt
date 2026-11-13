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

	expect(target.querySelector('[data-slot="file-upload-item"]')?.textContent).toContain(
		'notes.txt',
	);

	await userEvent.click(
		target.querySelector<HTMLButtonElement>('[aria-label="Remove notes.txt"]')!,
	);
	await tick();

	expect(target.querySelector('[data-slot="file-upload-item"]')).toBeNull();

	unmount(app);
	target.remove();
});
