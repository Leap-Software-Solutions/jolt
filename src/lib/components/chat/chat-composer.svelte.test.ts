import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatComposerTest from './chat-composer.test.svelte';

test('sends on Enter and keeps Shift+Enter for new lines', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatComposerTest, { target });
	const input = target.querySelector<HTMLTextAreaElement>('[data-slot="chat-composer-input"]');

	expect(input).not.toBeNull();
	await userEvent.fill(input!, 'Hello there');
	await tick();
	await userEvent.keyboard('{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="sent"]')?.textContent).toBe('Hello there');

	await userEvent.fill(input!, 'Line one');
	await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
	await tick();

	expect(input?.value).toContain('\n');
	expect(target.querySelector('[data-testid="sent"]')?.textContent).toBe('Hello there');

	unmount(app);
	target.remove();
});

test('accepts files dropped onto the composer', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatComposerTest, { target });
	await tick();

	const form = target.querySelector<HTMLFormElement>('[data-slot="chat-composer"]');
	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(new File(['notes'], 'notes.txt', { type: 'text/plain' }));

	form!.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
	await tick();

	expect(target.querySelector('[data-testid="dropped"]')?.textContent).toBe('notes.txt');

	unmount(app);
	target.remove();
});
