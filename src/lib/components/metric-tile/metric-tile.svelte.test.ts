import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import MetricTile from './metric-tile.svelte';

test('renders a labelled value and delta', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(MetricTile, {
		target,
		props: {
			label: 'Revenue',
			value: '$48.2k',
			delta: { value: '12.4%', direction: 'up', tone: 'positive' },
		},
	});

	expect(target.textContent).toContain('Revenue');
	expect(target.textContent).toContain('$48.2k');
	expect(target.textContent).toContain('Up');
	expect(target.textContent).toContain('12.4%');
	expect(target.querySelector('[data-slot="metric-tile-delta"]')?.className).toContain(
		'text-success',
	);

	unmount(app);
	target.remove();
});

test('renders loading skeletons', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(MetricTile, {
		target,
		props: { label: 'Revenue', value: '$48.2k', loading: true },
	});

	expect(target.querySelector('[data-slot="metric-tile"]')?.getAttribute('aria-busy')).toBe('true');
	expect(target.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(2);
	expect(target.querySelectorAll('[data-slot="skeleton"]')[0]?.parentElement?.className).toContain(
		'items-end',
	);
	expect(target.querySelector('[data-slot="metric-tile-value"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('renders an error instead of the value', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(MetricTile, {
		target,
		props: { label: 'Revenue', value: '$48.2k', error: 'Could not load revenue.' },
	});

	expect(target.querySelector('[role="alert"]')?.textContent).toContain('Could not load revenue.');
	expect(target.querySelector('[data-slot="metric-tile-value"]')).toBeNull();

	unmount(app);
	target.remove();
});
