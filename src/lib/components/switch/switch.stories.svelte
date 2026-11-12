<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as SwitchProps } from './switch.svelte';
	import Switch from './switch.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Switch',
		component: Switch,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Enable notifications',
		},
	});

	type TemplateArgs = SwitchProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<Switch {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Checked" args={{ checked: true }} {template} />

<Story
	name="With description"
	args={{
		label: 'Enable notifications',
		description: 'Receive a summary when a deployment finishes.',
	}}
	{template}
/>

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Disabled checked" args={{ checked: true, disabled: true }} {template} />
