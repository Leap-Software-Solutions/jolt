import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import TimeAgo from './time-ago.svelte';

const absoluteFormat = new Intl.DateTimeFormat('en', {
	dateStyle: 'medium',
	timeStyle: 'short',
});

function mountTimeAgo(date: Date | string): {
	target: HTMLDivElement;
	app: ReturnType<typeof mount>;
} {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(TimeAgo, { target, props: { date } });
	return { target, app };
}

test('renders a relative timestamp with an accessible absolute fallback', async () => {
	const date = new Date(Date.now() - 3 * 60 * 60 * 1000 - 30_000);
	const { target, app } = mountTimeAgo(date);
	await tick();

	const time = target.querySelector<HTMLTimeElement>('[data-slot="time-ago"]');
	const absolute = absoluteFormat.format(date);

	expect(time?.textContent?.trim()).toBe('3 hours ago');
	expect(time?.getAttribute('datetime')).toBe(date.toISOString());
	expect(time?.getAttribute('title')).toBe(absolute);
	expect(time?.getAttribute('aria-label')).toBe(absolute);

	unmount(app);
	target.remove();
});

test('renders an invalid date without a datetime attribute', async () => {
	const { target, app } = mountTimeAgo('not-a-date');
	await tick();

	const time = target.querySelector<HTMLTimeElement>('[data-slot="time-ago"]');

	expect(time?.textContent?.trim()).toBe('Invalid date');
	expect(time?.getAttribute('datetime')).toBeNull();
	expect(time?.getAttribute('title')).toBe('Invalid date');
	expect(time?.getAttribute('aria-label')).toBe('Invalid date');

	unmount(app);
	target.remove();
});
