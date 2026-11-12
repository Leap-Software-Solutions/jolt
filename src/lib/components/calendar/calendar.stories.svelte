<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Calendar from './calendar.svelte';
	import type { Props as CalendarProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/Calendar',
		component: Calendar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			weekStartsOn: 1,
		},
	});
</script>

<script lang="ts">
	import type { DateValue } from '@internationalized/date';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';

	let value = $state<DateValue>(today(getLocalTimeZone()));
	let rangeValues = $state<DateValue[]>([today(getLocalTimeZone())]);

	const formatter = new DateFormatter('en', { dateStyle: 'medium' });
</script>

{#snippet template(args: Omit<CalendarProps, 'value'>)}
	<div class="grid justify-items-center gap-3">
		<Calendar {...args} bind:value />
		<p class="text-xs text-muted-foreground">
			Selected: {formatter.format(value.toDate(getLocalTimeZone()))}
		</p>
	</div>
{/snippet}

{#snippet multipleTemplate(args: Omit<CalendarProps, 'value'>)}
	<Calendar {...args} type="multiple" bind:value={rangeValues} />
{/snippet}

<Story name="Default" {template} />

<Story name="Two months" args={{ numberOfMonths: 2 }} {template} />

<Story name="Multiple" template={multipleTemplate} />
