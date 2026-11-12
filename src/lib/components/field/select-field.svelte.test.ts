import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import SelectFieldTest from './select-field.test.svelte';

test('selects an option, updates the bound value, and exposes the error state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SelectFieldTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="select-trigger"]');

	expect(trigger).not.toBeNull();
	expect(trigger?.getAttribute('aria-invalid')).toBeNull();

	await userEvent.click(trigger!);
	await tick();

	const option = document.querySelector<HTMLElement>(
		'[data-slot="select-item"][data-value="draft"]',
	);

	expect(option).not.toBeNull();

	await userEvent.click(option!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('draft');
	expect(trigger?.getAttribute('aria-invalid')).toBe('true');
	expect(trigger?.getAttribute('aria-describedby')).toMatch(/-error$/);

	unmount(app);
	target.remove();
});
