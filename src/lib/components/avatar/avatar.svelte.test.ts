import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import AvatarTest from './avatar.test.svelte';

test('renders an accessible presence dot when a status is provided', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const withoutStatus = mount(AvatarTest, { target });
	expect(target.querySelector('[data-slot="avatar-status"]')).toBeNull();
	unmount(withoutStatus);

	const withStatus = mount(AvatarTest, { target, props: { status: 'online' } });
	const status = target.querySelector('[data-slot="avatar-status"]');

	expect(status).not.toBeNull();
	expect(status?.getAttribute('role')).toBe('img');
	expect(status?.getAttribute('aria-label')).toBe('Online');
	expect(status?.classList.contains('bg-success')).toBe(true);

	unmount(withStatus);
	target.remove();
});

test('uses a custom status label', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(AvatarTest, {
		target,
		props: { status: 'busy', statusLabel: 'In a focus session' },
	});
	const status = target.querySelector('[data-slot="avatar-status"]');

	expect(status?.getAttribute('aria-label')).toBe('In a focus session');
	expect(status?.classList.contains('bg-destructive')).toBe(true);

	unmount(app);
	target.remove();
});
