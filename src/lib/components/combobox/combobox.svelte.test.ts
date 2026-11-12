import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ComboboxTest from './combobox.test.svelte';

test('filters locally and selects an item', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ComboboxTest, { target });
	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');

	expect(input).not.toBeNull();

	await userEvent.click(input!);
	await userEvent.type(input!, 'grace');
	await tick();

	const items = Array.from(document.querySelectorAll<HTMLElement>('[data-slot="combobox-item"]'));
	expect(items).toHaveLength(1);
	expect(items[0].textContent).toContain('Grace Hopper');

	await userEvent.click(items[0]);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Grace Hopper');

	unmount(app);
	target.remove();
});
