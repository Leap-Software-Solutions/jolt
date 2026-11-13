import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
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
