import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import NavigationMenuTest from './navigation-menu.test.svelte';

test('opens a panel from the trigger', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(NavigationMenuTest, { target });
	const trigger = Array.from(target.querySelectorAll('button')).find(
		(button) => button.textContent?.trim() === 'Guides',
	);

	expect(trigger).not.toBeUndefined();

	await userEvent.click(trigger!);
	await new Promise((resolve) => setTimeout(resolve, 20));
	await tick();

	expect(document.body.textContent).toContain('Introduction');
	expect(document.body.textContent).toContain('Installation');

	unmount(app);
	target.remove();
});
