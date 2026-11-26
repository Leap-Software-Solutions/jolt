<script lang="ts">
	import { ArrowDownRightIcon, ArrowUpRightIcon, CircleAlertIcon, MinusIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Skeleton } from '../skeleton/index.js';
	import type { MetricDeltaDirection, MetricDeltaTone, Props } from './types.js';

	let {
		label,
		value,
		delta,
		sparkline,
		loading = false,
		error,
		class: className,
	}: Props = $props();

	const directionLabels: Record<MetricDeltaDirection, string> = {
		up: 'Up',
		down: 'Down',
		flat: 'No change',
	};
	const toneClasses: Record<MetricDeltaTone, string> = {
		positive: 'text-success',
		negative: 'text-destructive',
		neutral: 'text-muted-foreground',
	};
</script>

<div
	data-slot="metric-tile"
	data-loading={loading ? 'true' : undefined}
	data-error={error ? 'true' : undefined}
	aria-busy={loading || undefined}
	class={cls('flex flex-col gap-3 rounded-lg border bg-card p-4', className)}
>
	<p class="text-sm text-muted-foreground">{label}</p>

	{#if loading}
		<div class="flex flex-wrap items-end gap-x-2 gap-y-1">
			<Skeleton class="h-6 w-28" />
			<Skeleton class="h-3 w-16" />
		</div>
		{#if sparkline}
			<Skeleton class="h-10 w-full" />
		{/if}
	{:else if error}
		<div
			role="alert"
			class="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive"
		>
			<CircleAlertIcon aria-hidden="true" class="mt-0.5 size-4 shrink-0" />
			<p>{error}</p>
		</div>
	{:else}
		<div class="flex flex-wrap items-end gap-x-2 gap-y-1">
			<span
				data-slot="metric-tile-value"
				class="text-2xl/6 font-semibold tracking-tight tabular-nums"
			>
				{value}
			</span>
			{#if delta}
				<span
					data-slot="metric-tile-delta"
					class={cls(
						'inline-flex items-center gap-0.5 text-xs/3 font-medium',
						toneClasses[delta.tone ?? 'neutral'],
					)}
				>
					{#if delta.direction === 'up'}
						<ArrowUpRightIcon aria-hidden="true" class="size-3.5" />
					{:else if delta.direction === 'down'}
						<ArrowDownRightIcon aria-hidden="true" class="size-3.5" />
					{:else if delta.direction === 'flat'}
						<MinusIcon aria-hidden="true" class="size-3.5" />
					{/if}
					{#if delta.direction}
						<span class="sr-only">{directionLabels[delta.direction]} </span>
					{/if}
					<span>{delta.value}</span>
				</span>
			{/if}
		</div>
		{#if sparkline}
			<div data-slot="metric-tile-sparkline" class="min-w-0">
				{@render sparkline()}
			</div>
		{/if}
	{/if}
</div>
