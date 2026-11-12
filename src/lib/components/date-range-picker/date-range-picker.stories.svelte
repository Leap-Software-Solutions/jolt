<script lang="ts" module>
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DateRangePicker, { type Props as DateRangePickerProps } from './date-range-picker.svelte';

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 6 });

	const { Story } = defineMeta({
		title: 'Forms/DateRangePicker',
		component: DateRangePicker,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			ariaLabel: 'Reporting period',
		},
	});

	type TemplateArgs = Omit<DateRangePickerProps, 'value' | 'open'>;
</script>

<script lang="ts">
	let range = $state({ start, end });
	let emptyRange = $state({ start: undefined, end: undefined });
</script>

{#snippet template(args: TemplateArgs)}
	<DateRangePicker bind:value={range} {...args} />
{/snippet}

{#snippet emptyTemplate(args: TemplateArgs)}
	<DateRangePicker bind:value={emptyRange} {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="Empty" template={emptyTemplate} />

<Story name="One month" args={{ numberOfMonths: 1 }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
