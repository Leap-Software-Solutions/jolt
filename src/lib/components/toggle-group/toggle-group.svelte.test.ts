import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ToggleGroupTest from './toggle-group.test.svelte';

test('changes the pressed item and updates the bound value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ToggleGroupTest, { target });
	const items = target.querySelectorAll<HTMLButtonElement>('[data-slot="toggle-group-item"]');

	expect(items).toHaveLength(3);

	await userEvent.click(items[1]!);
	await tick();

	expect(items[1]?.getAttribute('data-state')).toBe('on');
	expect(items[0]?.getAttribute('data-state')).toBe('off');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('center');

	unmount(app);
	target.remove();
});
