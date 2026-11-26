<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MetricTile from './metric-tile.svelte';
	import type { Props as MetricTileProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Data Display/Metric Tile',
		component: MetricTile,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Revenue',
			value: '$48.2k',
			delta: { value: '12.4%', direction: 'up', tone: 'positive' },
		},
	});

	type TemplateArgs = Omit<MetricTileProps, 'sparkline'>;
</script>

{#snippet sparkline()}
	<svg
		viewBox="0 0 240 40"
		preserveAspectRatio="none"
		class="h-10 w-full text-brand-strong"
		role="img"
		aria-label="Revenue trend"
	>
		<path
			d="M0 30 L20 26 L40 29 L60 20 L80 23 L100 14 L120 18 L140 10 L160 15 L180 8 L200 12 L220 5 L240 8"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			vector-effect="non-scaling-stroke"
		/>
	</svg>
{/snippet}

{#snippet template(args: TemplateArgs)}
	<div class="w-[18rem] max-w-full">
		<MetricTile {...args} {sparkline} />
	</div>
{/snippet}

{#snippet plainTemplate(args: TemplateArgs)}
	<div class="w-[18rem] max-w-full">
		<MetricTile {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story
	name="Negative delta"
	args={{ delta: { value: '3.1%', direction: 'down', tone: 'negative' } }}
	{template}
/>

<Story name="Without sparkline" args={{}} template={plainTemplate} />

<Story name="Loading" args={{ loading: true }} template={plainTemplate} />

<Story name="Error" args={{ error: 'Could not load revenue.' }} template={plainTemplate} />
