import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatSuggestionsTest from './chat-suggestions.test.svelte';

test('selects a suggested prompt', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatSuggestionsTest, { target });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('[data-slot="chat-suggestions"] button');
	expect(button?.textContent).toContain('Summarise the latest release');

	await userEvent.click(button!);
	await tick();

	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe(
		'Summarise the latest release',
	);

	unmount(app);
	target.remove();
});
