import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import PopoverTest from './popover.test.svelte';

test('opens the popover and closes it with Escape', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(PopoverTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('button');

	expect(trigger).not.toBeNull();
	expect(target.querySelector('[data-testid="open"]')?.textContent).toBe('false');

	await userEvent.click(trigger!);
	await tick();

	expect(target.querySelector('[data-testid="open"]')?.textContent).toBe('true');
	expect(document.body.textContent).toContain('Popover body');

	await userEvent.keyboard('{Escape}');
	await tick();

	expect(target.querySelector('[data-testid="open"]')?.textContent).toBe('false');

	unmount(app);
	target.remove();
});
