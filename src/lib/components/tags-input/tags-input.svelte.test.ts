import { type ComponentProps, mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import TagsInputTest from './tags-input.test.svelte';

function mountTagsInput(
	target: HTMLElement,
	props: ComponentProps<typeof TagsInputTest> = {},
): ReturnType<typeof mount> {
	return mount(TagsInputTest, { target, props });
}

test('adds tags with Enter and removes the last tag with Backspace', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target);
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');
	expect(input).not.toBeNull();

	await userEvent.click(input!);
	await userEvent.type(input!, 'retro{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('retro');
	expect(target.querySelector('[data-slot="tags-input-chip"]')?.textContent).toContain('retro');

	await userEvent.type(input!, 'design,');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('retro|design');

	await userEvent.type(input!, '{Backspace}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('retro');

	unmount(app);
	target.remove();
});

test('removes a chip with its labelled remove button', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target, { value: ['retro', 'design'] });
	const remove = target.querySelector<HTMLButtonElement>('[aria-label="Remove retro"]');

	expect(remove).not.toBeNull();
	await userEvent.click(remove!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('design');

	unmount(app);
	target.remove();
});

test('splits a multi-value paste into tags', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target);
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	const clipboardData = new DataTransfer();
	clipboardData.setData('text/plain', 'one, two\nthree');
	input!.dispatchEvent(
		new ClipboardEvent('paste', {
			bubbles: true,
			cancelable: true,
			clipboardData,
		}),
	);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('one|two|three');

	unmount(app);
	target.remove();
});

test('rejects invalid and duplicate tags and reports the reason', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target, {
		value: ['retro'],
		validate: (tag: string) => tag !== 'blocked',
	});
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	await userEvent.type(input!, 'blocked{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('retro');
	expect(target.querySelector('[data-testid="rejected"]')?.textContent).toBe('blocked:invalid');
	expect(input?.value).toBe('blocked');

	await userEvent.clear(input!);
	await userEvent.type(input!, 'retro{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('retro');
	expect(target.querySelector('[data-testid="rejected"]')?.textContent).toBe('retro:duplicate');

	unmount(app);
	target.remove();
});

test('enforces the tag limit', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target, { maxTags: 1 });
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	await userEvent.type(input!, 'one{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('one');
	expect(input?.disabled).toBe(true);

	unmount(app);
	target.remove();
});

test('commits pending text on blur', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target);
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	await userEvent.type(input!, 'later');
	input!.blur();
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('later');

	unmount(app);
	target.remove();
});

test('wires invalid state and descriptions to the input', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountTagsInput(target, {
		invalid: true,
		describedBy: 'tags-help',
	});
	const input = target.querySelector<HTMLInputElement>('[data-slot="tags-input-input"]');

	expect(input?.getAttribute('aria-invalid')).toBe('true');
	expect(input?.getAttribute('aria-describedby')).toBe('tags-help');

	unmount(app);
	target.remove();
});
