<script lang="ts" module>
	import type { Component } from 'svelte';

	export type Severity = 'critical' | 'high' | 'medium' | 'low';

	type SeverityConfig = {
		label: string;
		icon: Component<{ class?: string }>;
		tone: string;
	};

	export type Props = {
		severity: Severity;
		/** Accessible and optional visible label. Defaults from the severity. */
		label?: string;
		showLabel?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { CircleAlert, Info, OctagonAlert, TriangleAlert } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';

	const severityConfig = {
		critical: { label: 'Critical', icon: OctagonAlert, tone: 'text-destructive' },
		high: { label: 'High', icon: TriangleAlert, tone: 'text-warning' },
		medium: { label: 'Medium', icon: CircleAlert, tone: 'text-info' },
		low: { label: 'Low', icon: Info, tone: 'text-muted-foreground' },
	} satisfies Record<Severity, SeverityConfig>;

	let { severity, label, showLabel = false, class: className }: Props = $props();

	const config = $derived(severityConfig[severity]);
	const text = $derived(label ?? config.label);
</script>

<span
	data-slot="severity-dot"
	data-severity={severity}
	role={showLabel ? undefined : 'img'}
	aria-label={showLabel ? undefined : text}
	title={showLabel ? undefined : text}
	class={cls('inline-flex items-center gap-1.5 text-xs font-medium', config.tone, className)}
>
	{#if config.icon}
		{@const Icon = config.icon}
		<span aria-hidden="true">
			<Icon class="size-3.5 shrink-0" />
		</span>
	{/if}
	{#if showLabel}
		<span>{text}</span>
	{/if}
</span>
