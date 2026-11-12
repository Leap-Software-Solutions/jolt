import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import CalendarTest from './calendar.test.svelte';

test('selects an outside-month date and moves to its month', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CalendarTest, { target });
	const outside = target.querySelector<HTMLElement>(
		'[data-outside-month][data-value="2026-12-01"]',
	);

	expect(outside).not.toBeNull();
	expect(outside?.getAttribute('data-disabled')).toBeNull();

	await userEvent.click(outside!);
	await tick();

	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('2026-12-01');
	expect(target.querySelector('button[aria-expanded]')?.textContent).toContain('December 2026');

	unmount(app);
	target.remove();
});
