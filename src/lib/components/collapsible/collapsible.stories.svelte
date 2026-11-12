<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import Collapsible, { type Props as CollapsibleProps } from './collapsible.svelte';

	const { Story } = defineMeta({
		title: 'Layout/Collapsible',
		component: Collapsible,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Release notes',
		},
	});
</script>

<script lang="ts">
	let open = $state(false);
</script>

{#snippet template(args: Omit<CollapsibleProps, 'children' | 'trigger' | 'open'>)}
	<div class="w-80">
		<Collapsible bind:open {...args}>
			<p>
				Jolt 0.1 adds form controls, disclosure patterns, and navigation primitives. Existing
				components keep their combined APIs.
			</p>
		</Collapsible>
	</div>
{/snippet}

{#snippet customTemplate(args: Omit<CollapsibleProps, 'children' | 'trigger' | 'open'>)}
	<div class="w-80">
		<Collapsible bind:open {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="outline" class="w-full justify-between">
					Show release notes
					<span class="text-xs text-muted-foreground">{open ? 'Hide' : 'Show'}</span>
				</Button>
			{/snippet}
			<p>
				Custom triggers keep full control over the button while retaining the disclosure behaviour.
			</p>
		</Collapsible>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Custom trigger" template={customTemplate} />

<Story name="Disabled" args={{ disabled: true }} {template} />
