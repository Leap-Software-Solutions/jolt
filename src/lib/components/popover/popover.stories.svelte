<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import Label from '../label/label.svelte';
	import Popover, { type Props as PopoverProps } from './popover.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Popover',
		component: Popover,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let open = $state(false);
</script>

{#snippet template(args: Omit<PopoverProps, 'trigger' | 'children' | 'open'>)}
	<Popover bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props} variant="outline">Open popover</Button>
		{/snippet}
		<div class="grid gap-1">
			<p class="text-sm font-medium">Popover content</p>
			<p class="text-sm text-muted-foreground">
				Use a popover for small, contextual surfaces that do not need a full dialog.
			</p>
		</div>
	</Popover>
{/snippet}

{#snippet formTemplate(args: Omit<PopoverProps, 'trigger' | 'children' | 'open'>)}
	<Popover bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props} variant="outline">Set dimensions</Button>
		{/snippet}
		<form class="grid gap-3" onsubmit={(event) => event.preventDefault()}>
			<div class="grid gap-1.5">
				<Label for="popover-width">Width</Label>
				<Input id="popover-width" value="640" />
			</div>
			<div class="grid gap-1.5">
				<Label for="popover-height">Height</Label>
				<Input id="popover-height" value="480" />
			</div>
			<Button type="submit" size="sm">Apply</Button>
		</form>
	</Popover>
{/snippet}

<Story name="Default" {template} />

<Story name="Top" args={{ side: 'top' }} {template} />

<Story name="Start aligned" args={{ align: 'start' }} {template} />

<Story name="With form" template={formTemplate} />
