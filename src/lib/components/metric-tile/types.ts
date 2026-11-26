import type { Snippet } from 'svelte';

export type MetricDeltaDirection = 'up' | 'down' | 'flat';
export type MetricDeltaTone = 'positive' | 'negative' | 'neutral';

export type MetricDelta = {
	value: string | number;
	direction?: MetricDeltaDirection;
	tone?: MetricDeltaTone;
};

export type Props = {
	label: string;
	value: string | number;
	delta?: MetricDelta;
	sparkline?: Snippet;
	loading?: boolean;
	error?: string;
	class?: string;
};
