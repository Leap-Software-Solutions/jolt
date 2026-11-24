<script lang="ts" module>
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DatePicker, { type Props as DatePickerProps } from './date-picker.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Date Picker',
		component: DatePicker,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			ariaLabel: 'Start date',
		},
	});

	type TemplateArgs = Omit<DatePickerProps, 'value' | 'open'>;
</script>

<script lang="ts">
	let date = $state(today(getLocalTimeZone()));
	let emptyDate = $state(undefined);
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid gap-2">
		<DatePicker bind:value={date} {...args} />
		<p class="text-xs text-muted-foreground">Selected: {date.toString()}</p>
	</div>
{/snippet}

{#snippet emptyTemplate(args: TemplateArgs)}
	<DatePicker bind:value={emptyDate} {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="Empty" template={emptyTemplate} />

<Story name="Disabled" args={{ disabled: true }} {template} />
