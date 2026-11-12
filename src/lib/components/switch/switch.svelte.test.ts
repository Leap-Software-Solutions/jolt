import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import SwitchTest from './switch.test.svelte';

test('toggles the bound checked state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SwitchTest, { target });
	const control = target.querySelector<HTMLButtonElement>('[data-slot="switch-control"]');

	expect(control).not.toBeNull();
	expect(control?.getAttribute('aria-checked')).toBe('false');

	await userEvent.click(control!);
	await tick();

	expect(control?.getAttribute('aria-checked')).toBe('true');
	expect(target.querySelector('[data-testid="checked"]')?.textContent).toBe('true');

	unmount(app);
	target.remove();
});
