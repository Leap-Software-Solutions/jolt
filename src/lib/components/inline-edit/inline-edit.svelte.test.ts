import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import InlineEditTest from './inline-edit.test.svelte';

function mountEditor(props: { multiline?: boolean; disabled?: boolean } = {}) {
	const target = document.createElement('div');
	target.style.width = '20rem';
	document.body.appendChild(target);
	const app = mount(InlineEditTest, { target, props });
	return { target, app };
}

async function openEditor(target: HTMLElement): Promise<HTMLInputElement | HTMLTextAreaElement> {
	const display = target.querySelector<HTMLButtonElement>('[data-slot="inline-edit-display"]');
	await userEvent.click(display!);
	await tick();
	return target.querySelector<HTMLInputElement | HTMLTextAreaElement>(
		'[data-slot="inline-edit-input"]',
	)!;
}

test('edits the value and commits with Enter', async () => {
	const { target, app } = mountEditor();
	await tick();

	const display = target.querySelector<HTMLButtonElement>('[data-slot="inline-edit-display"]');
	expect(display?.getAttribute('aria-label')).toBe('Edit: Move the release checklist');

	const input = await openEditor(target);
	await userEvent.fill(input, 'Updated card');
	await userEvent.keyboard('{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Updated card');
	expect(target.querySelector('[data-testid="changes"]')?.textContent).toBe('Updated card');
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('no');

	unmount(app);
	target.remove();
});

test('cancels with Escape and restores the original value', async () => {
	const { target, app } = mountEditor();
	await tick();

	const input = await openEditor(target);
	await userEvent.fill(input, 'This should not be saved');
	await userEvent.keyboard('{Escape}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe(
		'Move the release checklist',
	);
	expect(target.querySelector('[data-testid="changes"]')?.textContent).toBe('');
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('no');

	unmount(app);
	target.remove();
});

test('commits on blur when focus leaves the editor', async () => {
	const { target, app } = mountEditor();
	await tick();

	const input = await openEditor(target);
	await userEvent.fill(input, 'Blurred card');
	await userEvent.click(target.querySelector<HTMLButtonElement>('[data-testid="outside"]')!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Blurred card');
	expect(target.querySelector('[data-testid="changes"]')?.textContent).toBe('Blurred card');
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('no');

	unmount(app);
	target.remove();
});

test('saves and cancels with the action buttons', async () => {
	const { target, app } = mountEditor();
	await tick();

	const input = await openEditor(target);
	await userEvent.fill(input, 'Saved with the button');
	await userEvent.click(target.querySelector<HTMLButtonElement>('[aria-label="Save"]')!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Saved with the button');
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('no');

	const nextInput = await openEditor(target);
	await userEvent.fill(nextInput, 'Discard this');
	await userEvent.click(target.querySelector<HTMLButtonElement>('[aria-label="Cancel"]')!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Saved with the button');
	expect(target.querySelector('[data-testid="changes"]')?.textContent).toBe(
		'Saved with the button',
	);

	unmount(app);
	target.remove();
});

test('opens from an external binding and focuses the field', async () => {
	const { target, app } = mountEditor();
	await tick();

	await userEvent.click(target.querySelector<HTMLButtonElement>('[data-testid="external-edit"]')!);
	await tick();

	const input = target.querySelector<HTMLInputElement>('[data-slot="inline-edit-input"]');
	expect(input).not.toBeNull();
	expect(document.activeElement).toBe(input);
	expect(input?.selectionStart).toBe(0);
	expect(input?.selectionEnd).toBe('Move the release checklist'.length);

	unmount(app);
	target.remove();
});

test('allows clearing the value and shows the placeholder', async () => {
	const { target, app } = mountEditor();
	await tick();

	const input = await openEditor(target);
	await userEvent.fill(input, '');
	await userEvent.keyboard('{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('');
	const display = target.querySelector<HTMLButtonElement>('[data-slot="inline-edit-display"]');
	expect(display?.textContent?.trim()).toBe('Add a card');
	expect(display?.classList.contains('text-muted-foreground')).toBe(true);

	unmount(app);
	target.remove();
});

test('uses a textarea and Cmd/Ctrl+Enter to commit multiline values', async () => {
	const { target, app } = mountEditor({ multiline: true });
	await tick();

	const input = await openEditor(target);
	expect(input?.tagName).toBe('TEXTAREA');

	await userEvent.fill(input, 'First line\nSecond line');
	await userEvent.keyboard('{Enter}');
	await tick();
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('yes');

	await userEvent.keyboard('{Control>}{Enter}{/Control}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe(
		'First line\nSecond line',
	);
	expect(target.querySelector('[data-testid="editing"]')?.textContent).toBe('no');

	unmount(app);
	target.remove();
});

test('does not emit when the committed value is unchanged', async () => {
	const { target, app } = mountEditor();
	await tick();

	await openEditor(target);
	await userEvent.keyboard('{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="changes"]')?.textContent).toBe('');

	unmount(app);
	target.remove();
});

test('cannot enter edit mode when disabled', async () => {
	const { target, app } = mountEditor({ disabled: true });
	await tick();

	const display = target.querySelector<HTMLButtonElement>('[data-slot="inline-edit-display"]');
	expect(display?.disabled).toBe(true);
	expect(target.querySelector('[data-slot="inline-edit-input"]')).toBeNull();

	unmount(app);
	target.remove();
});
