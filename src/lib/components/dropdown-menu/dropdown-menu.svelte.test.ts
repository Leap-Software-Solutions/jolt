import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import DropdownMenuTest from './dropdown-menu.test.svelte';

test('opens the menu and runs the selected action', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DropdownMenuTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('button');

	expect(trigger).not.toBeNull();

	await userEvent.click(trigger!);
	await tick();

	const edit = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
		(item) => item.textContent?.trim() === 'Edit',
	);

	expect(edit).not.toBeUndefined();

	await userEvent.click(edit!);
	await tick();

	expect(target.querySelector('[data-testid="action"]')?.textContent).toBe('edit');

	unmount(app);
	target.remove();
});
