<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './calendar.svelte';

	let value = $state(new CalendarDate(2026, 11, 15));
</script>

<Calendar bind:value />
<span data-testid="selected">{value.toString()}</span>
