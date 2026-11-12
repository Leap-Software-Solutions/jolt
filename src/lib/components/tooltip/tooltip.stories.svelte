<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import Tooltip, { type Props as TooltipProps } from './tooltip.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Tooltip',
		component: Tooltip,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: Omit<TooltipProps, 'trigger'>)}
	<Tooltip {...args}>
		{#snippet trigger(props)}
			<Button {...props} variant="outline">Hover me</Button>
		{/snippet}
	</Tooltip>
{/snippet}

<Story name="Default" args={{ text: 'This is a tooltip' }} {template} />

<Story name="Bottom" args={{ text: 'Below the trigger', side: 'bottom' }} {template} />

<Story name="Right" args={{ text: 'To the right', side: 'right' }} {template} />

<Story
	name="Long text"
	args={{ text: 'A longer tooltip that wraps onto more than one line.' }}
	{template}
/>
