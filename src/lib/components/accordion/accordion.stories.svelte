<script lang="ts" module>
	import { Package, RotateCcw, ShieldCheck, Truck } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { AccordionItem, Props as AccordionProps } from './accordion.svelte';
	import Accordion from './accordion.svelte';

	const faqs: AccordionItem[] = [
		{
			value: 'shipping',
			title: 'How long does shipping take?',
			content: 'Orders ship within two business days and arrive in three to five days.',
			icon: Truck,
		},
		{
			value: 'returns',
			title: 'Can I return an item?',
			content: 'Yes. Returns are accepted within 30 days of delivery.',
			icon: RotateCcw,
		},
		{
			value: 'warranty',
			title: 'What does the warranty cover?',
			content: 'Every product includes a two-year warranty against manufacturing defects.',
			icon: ShieldCheck,
		},
		{
			value: 'packaging',
			title: 'Is the packaging recyclable?',
			content: 'All paper and cardboard packaging is recyclable.',
			icon: Package,
			disabled: true,
		},
	];

	const { Story } = defineMeta({
		title: 'Layout/Accordion',
		component: Accordion,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: faqs,
			value: 'shipping',
		},
	});

	type TemplateArgs = AccordionProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96">
		<Accordion {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Multiple" args={{ type: 'multiple', value: ['shipping', 'returns'] }} {template} />

<Story name="Collapsed" args={{ value: '' }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
