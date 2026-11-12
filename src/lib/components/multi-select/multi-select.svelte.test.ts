import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import MultiSelectTest from './multi-select.test.svelte';

test('selects and removes values', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(MultiSelectTest, { target });
	const input = target.querySelector<HTMLInputElement>('input');

	expect(input).not.toBeNull();

	await userEvent.click(input!);
	await userEvent.type(input!, 'ada');
	await tick();

	const ada = Array.from(
		document.querySelectorAll<HTMLElement>('[data-slot="multi-select-item"]'),
	).find((option) => option.textContent?.trim() === 'Ada Lovelace');

	expect(ada).not.toBeUndefined();

	await userEvent.click(ada!);
	await tick();

	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('Ada Lovelace');
	expect(target.textContent).toContain('Ada Lovelace');

	const remove = target.querySelector<HTMLButtonElement>('[aria-label="Remove Ada Lovelace"]');
	expect(remove).not.toBeNull();

	await userEvent.click(remove!);
	await tick();

	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('');

	unmount(app);
	target.remove();
});
