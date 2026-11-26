import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import DataTableTest from './data-table.test.svelte';
import DataTableSelectionTest from './data-table-selection.test.svelte';
import DataTableVirtualizedTest from './data-table-virtualized.test.svelte';

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

test('renders only a window of rows when virtualized', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DataTableVirtualizedTest, { target });
	await settle();

	const scrollElement = target.querySelector<HTMLElement>('[data-slot="data-table"]');
	const header = target.querySelector<HTMLElement>('[data-slot="data-table-header"]');
	const table = target.querySelector<HTMLTableElement>('table');
	const rows = target.querySelectorAll('[data-slot="data-table-row"]');

	expect(scrollElement?.style.height).toBe('220px');
	expect(header?.className).toContain('sticky');
	expect(table?.getAttribute('aria-rowcount')).toBe('501');
	expect(rows[0]?.getAttribute('aria-rowindex')).toBe('2');
	expect(rows.length).toBeGreaterThan(0);
	expect(rows.length).toBeLessThan(500);
	expect(rows[0]?.textContent).toContain('Engineer 1');

	scrollElement!.style.overflow = 'auto';
	scrollElement!.scrollTop = 1000;
	scrollElement!.dispatchEvent(new Event('scroll'));
	await settle();

	const scrolledRows = target.querySelectorAll('[data-slot="data-table-row"]');
	expect(scrollElement!.scrollTop).toBeGreaterThan(0);
	expect(scrolledRows.length).toBeGreaterThan(0);
	expect(scrolledRows.length).toBeLessThan(500);
	expect(scrolledRows[0]?.querySelector('td')?.textContent).not.toBe('Engineer 1');

	unmount(app);
	target.remove();
});

async function settle() {
	await tick();
	await new Promise<void>((resolve) => {
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
	});
}

test('selects all visible rows and clears them', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const onSelectionChange = vi.fn();
	const app = mount(DataTableSelectionTest, { target, props: { onSelectionChange } });
	await tick();

	const headerCheckbox = target.querySelector<HTMLElement>(
		'thead [data-slot="data-table-select"] [data-slot="checkbox-control"]',
	);
	const rowCheckboxes = target.querySelectorAll<HTMLElement>(
		'tbody [data-slot="data-table-select"] [data-slot="checkbox-control"]',
	);

	await userEvent.click(headerCheckbox!);
	await tick();

	expect(onSelectionChange).toHaveBeenLastCalledWith(['Grace Hopper', 'Ada Lovelace']);
	expect(rowCheckboxes[0]?.closest('tr')?.dataset.selected).toBe('true');
	expect(rowCheckboxes[1]?.closest('tr')?.dataset.selected).toBe('true');

	await userEvent.click(headerCheckbox!);
	await tick();

	expect(onSelectionChange).toHaveBeenLastCalledWith([]);
	expect(rowCheckboxes[0]?.closest('tr')?.dataset.selected).toBeUndefined();
	expect(rowCheckboxes[1]?.closest('tr')?.dataset.selected).toBeUndefined();

	unmount(app);
	target.remove();
});

test('replaces the selected row in single selection mode', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const onSelectionChange = vi.fn();
	const app = mount(DataTableSelectionTest, {
		target,
		props: { selectionMode: 'single', onSelectionChange },
	});
	await tick();

	const rowCheckboxes = target.querySelectorAll<HTMLElement>(
		'tbody [data-slot="data-table-select"] [data-slot="checkbox-control"]',
	);

	await userEvent.click(rowCheckboxes[0]!);
	await tick();
	await userEvent.click(rowCheckboxes[1]!);
	await tick();

	expect(onSelectionChange).toHaveBeenLastCalledWith(['Ada Lovelace']);
	expect(rowCheckboxes[0]?.closest('tr')?.dataset.selected).toBeUndefined();
	expect(rowCheckboxes[1]?.closest('tr')?.dataset.selected).toBe('true');

	unmount(app);
	target.remove();
});
