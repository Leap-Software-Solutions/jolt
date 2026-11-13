import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatToolCall from './chat-tool-call.svelte';

test('renders a tool call and expands its details', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatToolCall, {
		target,
		props: { name: 'search_codebase', status: 'success', summary: 'Found 3 files' },
	});
	await tick();

	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="chat-tool-call"] button');
	expect(trigger?.textContent).toContain('search_codebase');
	expect(trigger?.textContent).toContain('Complete');

	await userEvent.click(trigger!);
	await tick();

	expect(target.querySelector('[data-slot="chat-tool-call"]')?.getAttribute('data-state')).toBe(
		'open',
	);

	unmount(app);
	target.remove();
});
