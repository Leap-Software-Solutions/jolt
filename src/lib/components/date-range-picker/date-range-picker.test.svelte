<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import DateRangePicker, { type DateRangeValue } from './date-range-picker.svelte';

	let value = $state<DateRangeValue>({
		start: new CalendarDate(2026, 11, 3),
		end: undefined,
	});
</script>

<DateRangePicker bind:value ariaLabel="Reporting period" />
<span data-testid="range">
	{value.start?.toString() ?? ''} – {value.end?.toString() ?? ''}
</span>
