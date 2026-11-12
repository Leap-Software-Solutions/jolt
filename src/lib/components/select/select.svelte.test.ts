import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import SelectTest from './select.test.svelte';

test('selects an option and updates the bound value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SelectTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="select-trigger"]');

	expect(trigger).not.toBeNull();

	await userEvent.click(trigger!);
	await tick();

	const option = document.querySelector<HTMLElement>(
		'[data-slot="select-item"][data-value="draft"]',
	);

	expect(option).not.toBeNull();

	await userEvent.click(option!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('draft');

	unmount(app);
	target.remove();
});
