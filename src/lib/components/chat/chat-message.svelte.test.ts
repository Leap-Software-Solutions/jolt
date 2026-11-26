import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatMessage from './chat-message.svelte';
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

test('renders timestamps with TimeAgo', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatMessage, {
		target,
		props: {
			role: 'assistant',
			name: 'Jolt',
			timestamp: new Date('2026-01-01T12:00:00Z'),
		},
	});
	const time = target.querySelector('[data-slot="time-ago"]');

	expect(time?.getAttribute('datetime')).toBe('2026-01-01T12:00:00.000Z');
	expect(time?.getAttribute('aria-label')).toContain('Jan 1, 2026');

	unmount(app);
	target.remove();
});
