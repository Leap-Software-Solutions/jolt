<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TimePicker from './time-picker.svelte';
	import type { Props as TimePickerProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/Time Picker',
		component: TimePicker,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Meeting time',
			locale: 'en',
			hourCycle: 24,
		},
	});
</script>

<script lang="ts">
	import { Time } from '@internationalized/date';

	let value = $state<Time | undefined>(new Time(14, 30));
</script>

{#snippet template(args: Omit<TimePickerProps, 'value' | 'onValueChange'>)}
	<div class="w-64">
		<TimePicker {...args} bind:value />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Twelve hour" args={{ hourCycle: 12 }} {template} />

<Story name="Hours only" args={{ granularity: 'hour' }} {template} />

<Story name="With seconds" args={{ granularity: 'second' }} {template} />

<Story name="Invalid" args={{ error: 'Choose a future time.' }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
