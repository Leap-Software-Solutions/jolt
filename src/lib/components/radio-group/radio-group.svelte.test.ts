import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import RadioGroupTest from './radio-group.test.svelte';

test('selects an option and updates the bound value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(RadioGroupTest, { target });
	const controls = target.querySelectorAll<HTMLButtonElement>('[data-slot="radio-group-control"]');
	const labels = target.querySelectorAll<HTMLLabelElement>('label[for]');

	expect(controls).toHaveLength(2);

	await userEvent.click(labels[1]!);
	await tick();

	expect(controls[1]?.getAttribute('aria-checked')).toBe('true');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('growth');

	unmount(app);
	target.remove();
});
