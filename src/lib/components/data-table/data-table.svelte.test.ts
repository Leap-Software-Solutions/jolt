import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import DataTableTest from './data-table.test.svelte';

test('sorts rows when a sortable header is activated', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DataTableTest, { target });
	const nameHeader = target.querySelector<HTMLButtonElement>('th button');

	expect(nameHeader).not.toBeNull();
	expect(target.querySelector('[data-slot="data-table-row"] td')?.textContent).toContain(
		'Grace Hopper',
	);

	await userEvent.click(nameHeader!);
	await tick();

	expect(target.querySelector('th')?.getAttribute('aria-sort')).toBe('ascending');
	expect(target.querySelector('[data-slot="data-table-row"] td')?.textContent).toContain(
		'Ada Lovelace',
	);

	await userEvent.click(nameHeader!);
	await tick();

	expect(target.querySelector('th')?.getAttribute('aria-sort')).toBe('descending');
	expect(target.querySelector('[data-slot="data-table-row"] td')?.textContent).toContain(
		'Grace Hopper',
	);

	unmount(app);
	target.remove();
});
