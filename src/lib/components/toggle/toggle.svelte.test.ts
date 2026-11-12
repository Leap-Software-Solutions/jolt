import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ToggleTest from './toggle.test.svelte';

test('toggles the pressed state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ToggleTest, { target });
	const button = target.querySelector<HTMLButtonElement>('button');

	expect(button).not.toBeNull();
	expect(button?.getAttribute('aria-pressed')).toBe('false');

	await userEvent.click(button!);
	await tick();

	expect(button?.getAttribute('aria-pressed')).toBe('true');

	unmount(app);
	target.remove();
});
