import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import MenubarTest from './menubar.test.svelte';

test('opens a menu and runs an item', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(MenubarTest, { target });
	const trigger = Array.from(target.querySelectorAll('button')).find(
		(button) => button.textContent?.trim() === 'File',
	);

	expect(trigger).not.toBeUndefined();

	await userEvent.click(trigger!);
	await tick();

	const newFile = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
		(item) => item.textContent?.trim() === 'New file',
	);

	expect(newFile).not.toBeUndefined();

	await userEvent.click(newFile!);
	await tick();

	expect(target.querySelector('[data-testid="action"]')?.textContent).toBe('new');

	unmount(app);
	target.remove();
});
