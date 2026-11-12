import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import CheckboxFieldTest from './checkbox-field.test.svelte';

test('toggles the checkbox and clears the error state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CheckboxFieldTest, { target });
	const control = target.querySelector<HTMLButtonElement>('[data-slot="checkbox-control"]');

	expect(control).not.toBeNull();
	expect(control?.getAttribute('aria-invalid')).toBe('true');
	expect(control?.getAttribute('aria-describedby')).toMatch(/-error$/);

	await userEvent.click(control!);
	await tick();

	expect(control?.getAttribute('aria-checked')).toBe('true');
	expect(control?.getAttribute('aria-invalid')).toBeNull();
	expect(target.querySelector('[data-testid="checked"]')?.textContent).toBe('true');
	expect(target.textContent).not.toContain('Accept the terms before continuing.');

	unmount(app);
	target.remove();
});
