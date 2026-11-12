<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as RadioGroupProps, RadioGroupItem } from './radio-group.svelte';
	import RadioGroup from './radio-group.svelte';

	const plans: RadioGroupItem[] = [
		{ value: 'starter', label: 'Starter', description: 'For small teams getting started.' },
		{ value: 'growth', label: 'Growth', description: 'For teams shipping every week.' },
		{ value: 'scale', label: 'Scale', description: 'For larger organisations.' },
	];

	const { Story } = defineMeta({
		title: 'Forms/RadioGroup',
		component: RadioGroup,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: plans,
			value: 'growth',
			ariaLabel: 'Plan',
		},
	});

	type TemplateArgs = RadioGroupProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96">
		<RadioGroup {...args} />
	</div>
{/snippet}

{#snippet horizontalTemplate(args: TemplateArgs)}
	<div class="w-[48rem] max-w-full">
		<RadioGroup {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Horizontal" args={{ orientation: 'horizontal' }} template={horizontalTemplate} />

<Story
	name="Without descriptions"
	args={{
		items: [
			{ value: 'starter', label: 'Starter' },
			{ value: 'growth', label: 'Growth' },
			{ value: 'scale', label: 'Scale' },
		],
	}}
	{template}
/>

<Story
	name="Disabled option"
	args={{
		items: plans.map((item) => (item.value === 'scale' ? { ...item, disabled: true } : item)),
	}}
	{template}
/>

<Story name="Disabled" args={{ disabled: true }} {template} />
