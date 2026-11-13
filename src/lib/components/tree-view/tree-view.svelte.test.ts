import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import TreeViewTest from './tree-view.test.svelte';

function getRow(target: HTMLElement, id: string): HTMLElement | null {
	return target.querySelector<HTMLElement>(`[data-tree-node-id="${id}"]`);
}

function getCheckbox(target: HTMLElement, id: string): HTMLButtonElement | null {
	return (
		getRow(target, id)?.querySelector<HTMLButtonElement>('[data-slot="tree-view-checkbox"]') ?? null
	);
}

test('expands and collapses nodes with the keyboard', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TreeViewTest, { target });
	const src = getRow(target, 'src');
	const components = getRow(target, 'components');
	const button = getRow(target, 'button');

	expect(src).not.toBeNull();
	expect(components).not.toBeNull();
	expect(button).not.toBeNull();
	expect(button?.classList.contains('select-none')).toBe(true);

	src?.focus();
	await userEvent.keyboard('{ArrowLeft}');
	await tick();

	expect(src?.getAttribute('aria-expanded')).toBe('false');
	expect(target.querySelector('[data-testid="expanded"]')?.textContent).toBe('components');

	await userEvent.keyboard('{ArrowRight}');
	await tick();

	expect(src?.getAttribute('aria-expanded')).toBe('true');

	await userEvent.keyboard('{ArrowRight}');
	await tick();

	expect(document.activeElement).toBe(getRow(target, 'components'));

	await userEvent.keyboard('{ArrowDown}');
	await tick();

	expect(document.activeElement).toBe(getRow(target, 'button'));

	unmount(app);
	target.remove();
});

test('selects multiple nodes and toggles selection off', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TreeViewTest, { target, props: { selectionMode: 'multiple' } });
	const components = getRow(target, 'components');
	const button = getRow(target, 'button');

	await userEvent.click(components!);
	await tick();
	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('components');
	expect(components?.getAttribute('aria-selected')).toBe('true');

	await userEvent.click(button!);
	await tick();
	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('components,button');

	await userEvent.click(components!);
	await tick();
	expect(target.querySelector('[data-testid="selected"]')?.textContent).toBe('button');

	unmount(app);
	target.remove();
});

test('cascades checkbox state through parents and children', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TreeViewTest, { target, props: { checkable: true } });
	const components = getRow(target, 'components');
	const componentsCheckbox = getCheckbox(target, 'components');
	const buttonCheckbox = getCheckbox(target, 'button');

	await userEvent.click(componentsCheckbox!);
	await tick();

	expect(target.querySelector('[data-testid="checked"]')?.textContent).toBe(
		'components,button,dialog',
	);
	expect(components?.getAttribute('aria-checked')).toBe('true');

	await userEvent.click(buttonCheckbox!);
	await tick();

	expect(target.querySelector('[data-testid="checked"]')?.textContent).toBe('dialog');
	expect(components?.getAttribute('aria-checked')).toBe('mixed');

	await userEvent.click(componentsCheckbox!);
	await tick();

	expect(target.querySelector('[data-testid="checked"]')?.textContent).toBe(
		'components,button,dialog',
	);

	unmount(app);
	target.remove();
});

test('emits a move when a node is dropped onto another node', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(TreeViewTest, { target, props: { draggable: true } });
	const button = getRow(target, 'button');
	const tests = getRow(target, 'tests');
	const rect = tests?.getBoundingClientRect();
	const dataTransfer = new DataTransfer();

	expect(button?.getAttribute('draggable')).toBe('true');
	expect(tests).not.toBeNull();
	expect(rect).not.toBeUndefined();

	button!.dispatchEvent(
		new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }),
	);
	tests!.dispatchEvent(
		new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
			dataTransfer,
			clientY: rect!.top + rect!.height / 2,
		}),
	);
	await tick();
	tests!.dispatchEvent(
		new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
			dataTransfer,
			clientY: rect!.top + rect!.height / 2,
		}),
	);
	await tick();

	expect(target.querySelector('[data-testid="moves"]')?.textContent).toBe(
		JSON.stringify([{ id: 'button', parentId: 'tests', index: 1 }]),
	);
	expect(target.querySelector('[data-testid="expanded"]')?.textContent).toBe(
		'src,components,tests',
	);

	unmount(app);
	target.remove();
});
