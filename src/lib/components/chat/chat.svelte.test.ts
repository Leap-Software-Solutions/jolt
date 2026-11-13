import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatTest from './chat.test.svelte';

test('renders messages and sends from the composer', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatTest, { target });
	await tick();

	const messages = target.querySelectorAll('[data-slot="chat-message"]');
	const input = target.querySelector<HTMLTextAreaElement>('[data-slot="chat-composer-input"]');

	expect(messages).toHaveLength(2);
	expect(
		Array.from(target.querySelectorAll('[data-slot="chat-markdown"]')).some((element) =>
			element.textContent?.includes('Welcome message'),
		),
	).toBe(true);

	await userEvent.fill(input!, 'A new question');
	await userEvent.keyboard('{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="sent"]')?.textContent).toBe('A new question');

	unmount(app);
	target.remove();
});
