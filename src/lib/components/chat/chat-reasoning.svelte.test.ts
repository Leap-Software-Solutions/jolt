import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatReasoning from './chat-reasoning.svelte';

test('expands reasoning content', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatReasoning, {
		target,
		props: { duration: '4 seconds' },
	});
	await tick();

	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="chat-reasoning"] button');
	expect(trigger?.textContent).toContain('Reasoning');
	expect(trigger?.textContent).toContain('4 seconds');

	await userEvent.click(trigger!);
	await tick();

	expect(target.querySelector('[data-slot="chat-reasoning"]')?.getAttribute('data-state')).toBe(
		'open',
	);

	unmount(app);
	target.remove();
});
