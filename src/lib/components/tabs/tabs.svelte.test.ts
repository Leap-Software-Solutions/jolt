import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import TabsTest from './tabs.test.svelte';

test('switches the active tab and updates the bound value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TabsTest, { target });
	const activity = Array.from(
		target.querySelectorAll<HTMLButtonElement>('[data-slot="tabs-trigger"]'),
	).find((trigger) => trigger.textContent?.trim() === 'Activity');

	expect(activity).not.toBeUndefined();

	await userEvent.click(activity!);
	await tick();

	expect(activity?.getAttribute('aria-selected')).toBe('true');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('activity');
	expect(target.textContent).toContain('Activity content');

	unmount(app);
	target.remove();
});
