import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import SeverityDot from './severity-dot.svelte';

test('renders an accessible severity glyph without relying on colour alone', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(SeverityDot, { target, props: { severity: 'critical' } });
	await tick();

	const indicator = target.querySelector<HTMLElement>('[data-slot="severity-dot"]');
	expect(indicator?.getAttribute('role')).toBe('img');
	expect(indicator?.getAttribute('aria-label')).toBe('Critical');
	expect(indicator?.classList.contains('text-destructive')).toBe(true);
	expect(indicator?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');

	unmount(app);
	target.remove();
});

test('renders a visible custom label when requested', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(SeverityDot, {
		target,
		props: { severity: 'high', showLabel: true, label: 'Elevated' },
	});
	await tick();

	const indicator = target.querySelector<HTMLElement>('[data-slot="severity-dot"]');
	expect(indicator?.getAttribute('role')).toBeNull();
	expect(indicator?.textContent?.trim()).toBe('Elevated');
	expect(indicator?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');

	unmount(app);
	target.remove();
});
