import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import TextareaTest from './textarea.test.svelte';

test('binds the textarea value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TextareaTest, { target });
	const textarea = target.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]');

	expect(textarea).not.toBeNull();

	await userEvent.type(textarea!, 'Release notes');
	await tick();

	expect(textarea?.value).toBe('Release notes');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Release notes');

	unmount(app);
	target.remove();
});
