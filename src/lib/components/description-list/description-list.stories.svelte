<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Badge } from '../badge/index.js';
	import DescriptionList, {
		type DescriptionListItem,
		type Props as DescriptionListProps,
	} from './description-list.svelte';

	const connectionDetails: DescriptionListItem[] = [
		{ label: 'Connection', value: 'Primary workspace' },
		{ label: 'Endpoint', value: 'https://api.example.com/v1' },
		{ label: 'Region', value: 'eu-west-1' },
		{ label: 'Last checked', value: '3 minutes ago' },
	];

	const copyableDetails = connectionDetails.map((item) =>
		item.label === 'Endpoint' ? { ...item, copyable: true } : item,
	);

	const { Story } = defineMeta({
		title: 'Data Display/Description List',
		component: DescriptionList,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: connectionDetails,
		},
	});
</script>

{#snippet template(args: DescriptionListProps)}
	<div class="w-[32rem] rounded-lg border bg-card p-4">
		<DescriptionList {...args} />
	</div>
{/snippet}

{#snippet customValueTemplate(args: DescriptionListProps)}
	<div class="w-[32rem] rounded-lg border bg-card p-4">
		<DescriptionList {...args}>
			{#snippet value(item)}
				{#if item.label === 'Status'}
					<Badge label="Connected" variant="secondary" />
				{:else}
					{item.value}
				{/if}
			{/snippet}
		</DescriptionList>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Stacked" args={{ layout: 'stacked' }} {template} />

<Story name="With copy" args={{ items: copyableDetails }} {template} />

<Story name="Loading" args={{ loading: true }} {template} />

<Story
	name="Custom value"
	args={{
		items: [
			{ label: 'Status', value: 'Connected' },
			{ label: 'Region', value: 'eu-west-1' },
		],
	}}
	template={customValueTemplate}
/>
