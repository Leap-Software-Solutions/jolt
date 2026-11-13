import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatViewportTest from './chat-viewport.test.svelte';

test('renders a labelled log and scrolls to the latest content', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatViewportTest, { target });
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 50));

	const viewport = target.querySelector<HTMLElement>('[data-slot="chat-viewport-scroll"]');
	const log = target.querySelector('[role="log"]');

	expect(log?.getAttribute('aria-label')).toBe('Conversation');
	expect(viewport).not.toBeNull();
	expect(viewport?.scrollTop).toBeGreaterThan(0);

	unmount(app);
	target.remove();
});
