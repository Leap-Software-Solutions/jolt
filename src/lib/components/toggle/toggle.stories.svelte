<script lang="ts" module>
	import { BoldIcon, HeartIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as ToggleProps } from './toggle.svelte';
	import Toggle from './toggle.svelte';

	const { Story } = defineMeta({
		title: 'Actions/Toggle',
		component: Toggle,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let pressed = $state(false);
	let iconPressed = $state(false);
</script>

{#snippet template(args: Omit<ToggleProps, 'pressed' | 'children' | 'ariaLabel'>)}
	<Toggle {...args} bind:pressed ariaLabel="Bold">
		<BoldIcon class="size-4" />
		Bold
	</Toggle>
{/snippet}

{#snippet iconTemplate(args: Omit<ToggleProps, 'pressed' | 'children' | 'ariaLabel'>)}
	<Toggle {...args} bind:pressed={iconPressed} ariaLabel="Favourite">
		<HeartIcon class="size-4" />
	</Toggle>
{/snippet}

<Story name="Default" {template} />

<Story name="Outline" args={{ variant: 'outline' }} {template} />

<Story name="Icon only" template={iconTemplate} />
