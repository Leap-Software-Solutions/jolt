import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import EmailInputTest from './email-input.test.svelte';

function mountEmailInput(
	target: HTMLElement,
	props: { value?: string[] } = {},
): ReturnType<typeof mount> {
	return mount(EmailInputTest, { target, props });
}

test('adds a typed address and normalises it', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountEmailInput(target);
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	await userEvent.type(input!, 'ADA@Example.COM,');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('ada@example.com');

	unmount(app);
	target.remove();
});

test('splits a pasted invitation list on separators and whitespace', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountEmailInput(target);
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	const clipboardData = new DataTransfer();
	clipboardData.setData('text/plain', 'grace@example.com; alan@example.com\nkatherine@example.com');
	input!.dispatchEvent(
		new ClipboardEvent('paste', {
			bubbles: true,
			cancelable: true,
			clipboardData,
		}),
	);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe(
		'grace@example.com|alan@example.com|katherine@example.com',
	);

	unmount(app);
	target.remove();
});

test('rejects invalid and duplicate addresses', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountEmailInput(target, { value: ['ada@example.com'] });
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	await userEvent.type(input!, 'not-an-email,');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('ada@example.com');
	expect(target.querySelector('[data-testid="rejected"]')?.textContent).toBe(
		'not-an-email:invalid',
	);

	await userEvent.clear(input!);
	await userEvent.type(input!, 'ADA@EXAMPLE.COM,');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('ada@example.com');
	expect(target.querySelector('[data-testid="rejected"]')?.textContent).toBe(
		'ada@example.com:duplicate',
	);

	unmount(app);
	target.remove();
});
