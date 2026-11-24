import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import AvatarGroupTest from './avatar-group.test.svelte';

test('limits the visible avatars and shows the overflow count', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(AvatarGroupTest, { target });
	const group = target.querySelector('[data-slot="avatar-group"]');
	const overflow = target.querySelector('[data-slot="avatar-group-overflow"]');

	expect(group?.getAttribute('role')).toBe('group');
	expect(group?.querySelectorAll('[data-slot="avatar-group-item"]')).toHaveLength(2);
	expect(group?.querySelectorAll('[data-slot="avatar-status"]')).toHaveLength(2);
	expect(group?.querySelector('[data-slot="avatar-status"]')?.getAttribute('aria-label')).toBe(
		'Online',
	);
	expect(overflow?.textContent).toContain('+2');
	expect(overflow?.getAttribute('aria-label')).toBe('2 more');

	unmount(app);
	target.remove();
});
