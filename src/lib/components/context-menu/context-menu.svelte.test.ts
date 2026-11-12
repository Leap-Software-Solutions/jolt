import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ContextMenuTest from './context-menu.test.svelte';

test('opens on right click and runs the selected item', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ContextMenuTest, { target });
	const trigger = target.querySelector<HTMLElement>('[data-testid="context-menu-trigger"]');

	expect(trigger).not.toBeNull();

	await userEvent.click(trigger!, { button: 'right' });
	await tick();

	expect(document.body.textContent).toContain('Duplicate');

	const duplicate = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
		(item) => item.textContent?.trim() === 'Duplicate',
	);

	expect(duplicate).not.toBeUndefined();

	await userEvent.click(duplicate!);
	await tick();

	expect(target.querySelector('[data-testid="last-action"]')?.textContent).toBe('duplicate');

	unmount(app);
	target.remove();
});
