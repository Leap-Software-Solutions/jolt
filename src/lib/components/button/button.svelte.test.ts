import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { buttonVariants } from './button.svelte';
import ButtonTest from './button.test.svelte';

test('renders its label with the default variant classes', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ButtonTest, { target });
	const button = target.querySelector('button');

	expect(button).not.toBeNull();
	expect(button?.textContent).toContain('Click me');
	expect(button?.className).toContain('bg-primary');

	unmount(app);
	target.remove();
});

test('builds brand variant classes', () => {
	expect(buttonVariants({ variant: 'brand' })).toContain('bg-brand');
});
