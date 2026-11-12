import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import SidebarTest from './sidebar.test.svelte';

test('marks the active route and handles navigation actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SidebarTest, { target });

	expect(target.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Home');

	const settings = Array.from(target.querySelectorAll('button')).find(
		(button) => button.textContent?.trim() === 'Settings',
	);

	expect(settings).not.toBeUndefined();

	await userEvent.click(settings!);
	await tick();

	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('settings');

	unmount(app);
	target.remove();
});
