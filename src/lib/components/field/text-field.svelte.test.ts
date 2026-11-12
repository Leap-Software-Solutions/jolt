import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import TextFieldTest from './text-field.test.svelte';

test('binds the input value and describes the invalid state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TextFieldTest, { target });
	const input = target.querySelector<HTMLInputElement>('[data-slot="input"]');

	expect(input).not.toBeNull();
	expect(input?.getAttribute('aria-invalid')).toBeNull();

	await userEvent.type(input!, 'bad');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('bad');
	expect(input?.getAttribute('aria-invalid')).toBe('true');
	expect(input?.getAttribute('aria-describedby')).toMatch(/-error$/);
	expect(target.textContent).toContain('Enter a valid email address.');

	unmount(app);
	target.remove();
});
