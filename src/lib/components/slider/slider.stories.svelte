<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as SliderProps } from './slider.svelte';
	import Slider from './slider.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Slider',
		component: Slider,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			value: 40,
			ariaLabel: 'Volume',
		},
	});

	type TemplateArgs = SliderProps;
	type MultipleArgs = Omit<SliderProps, 'value'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<Slider {...args} />
	</div>
{/snippet}

{#snippet labeledTemplate(args: TemplateArgs)}
	<div class="w-80">
		<Slider {...args} label="Monthly spend" showValue />
	</div>
{/snippet}

{#snippet multipleTemplate(args: MultipleArgs)}
	<div class="w-80">
		<Slider {...args} type="multiple" value={[25, 75]} label="Price range" showValue />
	</div>
{/snippet}

{#snippet verticalTemplate(args: TemplateArgs)}
	<div class="flex h-52 items-center">
		<Slider {...args} orientation="vertical" label="Volume" showValue />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With label" template={labeledTemplate} />

<Story name="Range" template={multipleTemplate} />

<Story name="Vertical" template={verticalTemplate} />

<Story name="Stepped" args={{ min: 0, max: 100, step: 10 }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
