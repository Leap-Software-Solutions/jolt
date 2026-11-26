import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import DescriptionList from './description-list.svelte';

function mountList(props: Record<string, unknown> = {}): {
	target: HTMLDivElement;
	app: ReturnType<typeof mount>;
} {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(DescriptionList, {
		target,
		props: {
			items: [
				{ label: 'Connection', value: 'Primary workspace' },
				{ label: 'Endpoint', value: 'https://api.example.com/v1', copyable: true },
			],
			...props,
		},
	});
	return { target, app };
}

test('renders label and value rows with description list semantics', async () => {
	const { target, app } = mountList();
	await tick();

	expect(target.querySelector('dl')).not.toBeNull();
	expect(target.querySelector('[data-slot="description-list-label"]')?.textContent).toBe(
		'Connection',
	);
	expect(target.querySelector('[data-slot="description-list-value"]')?.textContent?.trim()).toBe(
		'Primary workspace',
	);
	expect(target.querySelectorAll('[data-slot="description-list-row"]')).toHaveLength(2);

	unmount(app);
	target.remove();
});

test('renders the configured layout', async () => {
	const { target, app } = mountList({ layout: 'stacked' });
	await tick();

	expect(target.querySelector('[data-slot="description-list"]')?.getAttribute('data-layout')).toBe(
		'stacked',
	);

	unmount(app);
	target.remove();
});

test('renders a copy control for copyable values', async () => {
	const { target, app } = mountList();
	await tick();

	const copyButton = target.querySelector<HTMLButtonElement>(
		'[data-slot="description-list-value"] button',
	);
	const value = copyButton?.closest<HTMLElement>('[data-slot="description-list-value"]');
	expect(value?.classList.contains('items-center')).toBe(true);
	expect(copyButton).not.toBeNull();
	expect(copyButton?.getAttribute('aria-label')).toBe('Copy Endpoint');

	unmount(app);
	target.remove();
});

test('renders skeleton rows and marks the list busy while loading', async () => {
	const { target, app } = mountList({ loading: true, skeletonRows: 2 });
	await tick();

	const rows = target.querySelectorAll('[data-slot="description-list-row"]');
	expect(target.querySelector('dl')?.getAttribute('aria-busy')).toBe('true');
	expect(rows).toHaveLength(2);
	expect(rows[0]?.classList.contains('border-b')).toBe(true);
	expect(rows[1]?.classList.contains('border-b')).toBe(true);
	expect(rows[1]?.classList.contains('last:border-b-0')).toBe(true);
	expect(target.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(4);
	expect(target.querySelector('[data-slot="skeleton"]')?.classList.contains('h-5')).toBe(true);

	unmount(app);
	target.remove();
});
