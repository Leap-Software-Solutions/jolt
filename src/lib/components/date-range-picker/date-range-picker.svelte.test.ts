import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import DateRangePickerTest from './date-range-picker.test.svelte';

test('selects a complete date range and closes the popover', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DateRangePickerTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('button');

	expect(trigger).not.toBeNull();

	await userEvent.click(trigger!);
	await tick();

	const end = document.querySelector<HTMLElement>(
		'[data-slot="calendar"] [role="button"][data-value="2026-11-07"]',
	);

	expect(end).not.toBeNull();

	await userEvent.click(end!);
	await tick();

	expect(target.querySelector('[data-testid="range"]')?.textContent).toContain('2026-11-07');
	expect(trigger?.getAttribute('aria-expanded')).toBe('false');

	unmount(app);
	target.remove();
});
