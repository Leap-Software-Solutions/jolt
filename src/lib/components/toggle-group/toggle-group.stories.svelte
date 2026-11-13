<script lang="ts" module>
	import {
		Bold,
		Italic,
		TextAlignCenter,
		TextAlignEnd,
		TextAlignStart,
		Underline,
	} from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as ToggleGroupProps, ToggleGroupItem } from './toggle-group.svelte';
	import ToggleGroup from './toggle-group.svelte';

	const alignments: ToggleGroupItem[] = [
		{ value: 'left', ariaLabel: 'Align left', icon: TextAlignStart },
		{ value: 'center', ariaLabel: 'Align center', icon: TextAlignCenter },
		{ value: 'right', ariaLabel: 'Align right', icon: TextAlignEnd },
	];

	const formatting: ToggleGroupItem[] = [
		{ value: 'bold', ariaLabel: 'Bold', icon: Bold },
		{ value: 'italic', ariaLabel: 'Italic', icon: Italic },
		{ value: 'underline', ariaLabel: 'Underline', icon: Underline },
	];

	const { Story } = defineMeta({
		title: 'Actions/ToggleGroup',
		component: ToggleGroup,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: alignments,
			value: 'left',
			ariaLabel: 'Text alignment',
		},
	});

	type TemplateArgs = ToggleGroupProps;
</script>

{#snippet template(args: TemplateArgs)}
	<ToggleGroup {...args} />
{/snippet}

<Story name="Default" {template} />

<Story
	name="Multiple"
	args={{ items: formatting, value: ['bold'], type: 'multiple', ariaLabel: 'Formatting' }}
	{template}
/>

<Story name="Outline" args={{ variant: 'outline' }} {template} />

<Story
	name="With labels"
	args={{ items: alignments.map((item) => ({ ...item, label: item.ariaLabel })) }}
	{template}
/>

<Story name="Vertical" args={{ orientation: 'vertical', items: formatting }} {template} />

<Story name="Small" args={{ size: 'sm' }} {template} />

<Story name="Large" args={{ size: 'lg' }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
