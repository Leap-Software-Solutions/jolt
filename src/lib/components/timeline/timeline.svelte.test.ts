import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import Timeline from './timeline.svelte';
import TimelineTest from './timeline.test.svelte';
import type { TimelineGroup } from './types.js';

const groups: TimelineGroup[] = [
	{
		id: 'today',
		label: 'Today',
		events: [
			{
				id: 'deploy',
				title: 'Deployment completed',
				description: 'Production is serving the new build.',
				timestamp: new Date('2026-01-02T12:00:00Z'),
				actor: { name: 'Ada Lovelace', initials: 'AL' },
				tone: 'success',
			},
			{
				id: 'review',
				title: 'Review requested',
				timestamp: new Date('2026-01-02T11:00:00Z'),
				tone: 'info',
			},
		],
	},
	{
		id: 'yesterday',
		label: 'Yesterday',
		events: [
			{
				id: 'incident',
				title: 'Incident resolved',
				tone: 'warning',
			},
		],
	},
];

test('renders grouped events with markers, timestamps, and connectors', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Timeline, {
		target,
		props: { groups, ariaLabel: 'Recent activity' },
	});
	await tick();

	expect(target.querySelector('[data-slot="timeline"]')?.getAttribute('aria-label')).toBe(
		'Recent activity',
	);
	expect(
		[...target.querySelectorAll('[data-slot="timeline-group-label"]')].map((label) =>
			label.textContent?.trim(),
		),
	).toEqual(['Today', 'Yesterday']);
	expect(
		[...target.querySelectorAll('[data-slot="timeline-event-title"]')].map(
			(title) => title.textContent,
		),
	).toEqual(['Deployment completed', 'Review requested', 'Incident resolved']);
	expect(target.querySelector('[data-slot="avatar-image"]')).toBeNull();
	expect(target.querySelector('[data-slot="avatar-fallback"]')?.textContent).toBe('AL');
	expect(
		[...target.querySelectorAll('[data-slot="timeline-marker"]')].map((marker) =>
			marker.getAttribute('data-tone'),
		),
	).toEqual(['success', 'info', 'warning']);

	const timestamps = target.querySelectorAll<HTMLTimeElement>('[data-slot="time-ago"]');
	expect(timestamps).toHaveLength(2);
	expect(timestamps[0]?.getAttribute('datetime')).toBe('2026-01-02T12:00:00.000Z');
	expect(timestamps[1]?.getAttribute('datetime')).toBe('2026-01-02T11:00:00.000Z');
	expect(target.querySelectorAll('[data-slot="timeline-connector"]')).toHaveLength(1);

	unmount(app);
	target.remove();
});

test('activates an event from its keyboard-operable button', async () => {
	const onEvent = vi.fn();
	const event = { id: 'deploy', title: 'Deployment completed' };
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Timeline, {
		target,
		props: {
			groups: [{ id: 'today', events: [{ ...event, onActivate: onEvent }] }],
		},
	});
	await tick();

	const trigger = target.querySelector<HTMLButtonElement>('button');
	expect(trigger).not.toBeNull();

	trigger?.click();
	await tick();

	expect(onEvent).toHaveBeenCalledTimes(1);
	expect(onEvent.mock.calls[0]?.[0]).toMatchObject({ id: 'deploy' });

	unmount(app);
	target.remove();
});

test('uses a link when an href is provided', async () => {
	const onActivate = vi.fn();
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Timeline, {
		target,
		props: {
			groups: [
				{
					id: 'today',
					events: [
						{
							id: 'deploy',
							title: 'Deployment completed',
							href: '/activity/deploy',
							onActivate,
						},
					],
				},
			],
		},
	});
	await tick();

	const link = target.querySelector<HTMLAnchorElement>('a');
	expect(link?.getAttribute('href')).toBe('/activity/deploy');
	expect(target.querySelector('button')).toBeNull();

	unmount(app);
	target.remove();
});

test('centers event titles on the marker axis', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(Timeline, {
		target,
		props: {
			groups: [
				{
					id: 'today',
					events: [{ id: 'access', title: 'Workspace access updated' }],
				},
			],
		},
	});
	await tick();

	const marker = target.querySelector<HTMLElement>('[data-slot="timeline-marker"]');
	const title = target.querySelector<HTMLElement>('[data-slot="timeline-event-title"]');
	const markerBox = marker!.getBoundingClientRect();
	const titleBox = title!.getBoundingClientRect();
	const markerCenter = markerBox.top + markerBox.height / 2;
	const titleCenter = titleBox.top + titleBox.height / 2;

	expect(Math.abs(markerCenter - titleCenter)).toBeLessThanOrEqual(0.5);

	unmount(app);
	target.remove();
});

test('renders a custom marker snippet', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(TimelineTest, {
		target,
		props: { groups, useCustomMarker: true },
	});
	await tick();

	expect(
		[...target.querySelectorAll('[data-testid="custom-marker"]')].map(
			(marker) => marker.textContent,
		),
	).toEqual(['deploy', 'review', 'incident']);

	unmount(app);
	target.remove();
});
