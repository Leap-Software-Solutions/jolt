import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Badge from './badge.svelte';

test('renders the selected semantic status variant', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Badge, {
		target,
		props: { label: 'Passed', variant: 'success' },
	});
	await tick();

	const badge = target.querySelector<HTMLElement>('[data-slot="badge"]');
	expect(badge?.getAttribute('data-variant')).toBe('success');
	expect(badge?.classList.contains('text-success')).toBe(true);
	expect(badge?.classList.contains('bg-success/10')).toBe(true);

	unmount(app);
	target.remove();
});

test('renders a decorative dot that inherits the semantic text tone', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Badge, {
		target,
		props: { label: 'Delayed', variant: 'warning', dot: true },
	});
	await tick();

	const dot = target.querySelector<HTMLElement>('[data-slot="badge-dot"]');
	expect(dot).not.toBeNull();
	expect(dot?.getAttribute('aria-hidden')).toBe('true');
	expect(dot?.classList.contains('bg-current')).toBe(true);

	unmount(app);
	target.remove();
});

test('renders a compact count badge', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Badge, { target, props: { count: 12 } });
	await tick();

	const badge = target.querySelector<HTMLElement>('[data-slot="badge"]');
	expect(badge?.textContent?.trim()).toBe('12');
	expect(badge?.classList.contains('tabular-nums')).toBe(true);

	unmount(app);
	target.remove();
});

test('caps counts at the configured maximum', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Badge, { target, props: { count: 128, maxCount: 99 } });
	await tick();

	expect(target.querySelector('[data-slot="badge"]')?.textContent?.trim()).toBe('99+');

	unmount(app);
	target.remove();
});
