import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatMessageTest from './chat-message.test.svelte';

test('renders a user message with the user role and right alignment', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatMessageTest, { target });
	const message = target.querySelector('[data-slot="chat-message"]');
	const bubble = target.querySelector('[data-slot="chat-message-bubble"]');

	expect(message?.getAttribute('data-role')).toBe('user');
	expect(message?.className).toContain('flex-row-reverse');
	expect(bubble?.textContent).toContain('Hello from Ada');
	expect(bubble?.className).toContain('bg-primary');

	unmount(app);
	target.remove();
});
