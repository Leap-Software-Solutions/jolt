import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import ComboboxCreatableTest from './combobox-creatable.test.svelte';

function mountCreatable(
	target: HTMLElement,
	createItem: (label: string) => { id: string; name: string; pending?: boolean } | undefined,
): ReturnType<typeof mount> {
	return mount(ComboboxCreatableTest, {
		target,
		props: {
			creatable: true,
			createItem,
		},
	});
}

test('creates a value from typed text and keeps its label selected', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountCreatable(target, (label) => ({
		id: `invite:${label}`,
		name: label,
		pending: true,
	}));
	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');

	await userEvent.click(input!);
	await userEvent.type(input!, 'New Person');
	await tick();

	const create = document.querySelector<HTMLElement>('[data-slot="combobox-create"]');
	expect(create?.textContent).toContain('Create “New Person”');

	await userEvent.click(create!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('New Person:true');
	expect(input?.value).toBe('New Person');

	unmount(app);
	target.remove();
});

test('creates a value with Enter when the create row is highlighted', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountCreatable(target, (label) => ({
		id: `invite:${label}`,
		name: label,
		pending: true,
	}));
	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');

	await userEvent.click(input!);
	await userEvent.type(input!, 'Another Person{Enter}');
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('Another Person:true');

	unmount(app);
	target.remove();
});

test('does not offer creation for an existing label', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountCreatable(target, (label) => ({ id: `invite:${label}`, name: label }));
	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');

	await userEvent.click(input!);
	await userEvent.type(input!, 'Ada Lovelace');
	await tick();

	expect(document.querySelector('[data-slot="combobox-create"]')).toBeNull();
	expect(document.querySelector('[data-slot="combobox-item"]')?.textContent).toContain(
		'Ada Lovelace',
	);

	unmount(app);
	target.remove();
});

test('rejects creation when the factory returns undefined', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mountCreatable(target, () => undefined);
	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');

	await userEvent.click(input!);
	await userEvent.type(input!, 'Rejected');
	await tick();

	const create = document.querySelector<HTMLElement>('[data-slot="combobox-create"]');
	await userEvent.click(create!);
	await tick();

	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('none');

	unmount(app);
	target.remove();
});

test('does not evaluate a custom create label before the user types', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const createLabel = vi.fn((query: string) => `Invite “${query}”`);
	const app = mount(ComboboxCreatableTest, {
		target,
		props: {
			creatable: true,
			createItem: (label: string) => ({ id: `invite:${label}`, name: label }),
			createLabel,
		},
	});
	await tick();

	expect(createLabel).not.toHaveBeenCalled();

	const input = target.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');
	await userEvent.click(input!);
	await userEvent.type(input!, 'Guest');
	await tick();

	expect(createLabel).toHaveBeenCalledWith('Guest');
	expect(document.querySelector('[data-slot="combobox-create"]')?.textContent).toContain(
		'Invite “Guest”',
	);

	unmount(app);
	target.remove();
});
