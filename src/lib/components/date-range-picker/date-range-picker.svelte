<script lang="ts" module>
	import type { DateValue } from '@internationalized/date';
	import type { CalendarRange, CalendarValue } from '../calendar/types.js';

	export type DateRangeValue = CalendarRange;

	export type DateRangePickerWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

	export type Props = {
		value?: DateRangeValue;
		onValueChange?: (value: DateRangeValue) => void;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placeholder?: string;
		ariaLabel?: string;
		calendarLabel?: string;
		minValue?: DateValue;
		maxValue?: DateValue;
		minDays?: number;
		maxDays?: number;
		numberOfMonths?: number;
		disabled?: boolean;
		readonly?: boolean;
		locale?: string;
		weekStartsOn?: DateRangePickerWeekStartsOn;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { CalendarIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Calendar } from '../calendar/index.js';
	import { Popover } from '../popover/index.js';

	let {
		value = $bindable({ start: undefined, end: undefined }),
		onValueChange,
		open = $bindable(false),
		onOpenChange,
		placeholder = 'Pick a date range',
		ariaLabel = 'Choose a date range',
		calendarLabel = 'Choose a date range',
		minValue,
		maxValue,
		minDays,
		maxDays,
		numberOfMonths = 2,
		disabled,
		readonly,
		locale = 'en',
		weekStartsOn,
		class: className,
		triggerClass,
		contentClass,
	}: Props = $props();

	const formatter = $derived(new DateFormatter(locale, { dateStyle: 'medium' }));
	const displayValue = $derived.by(() => {
		const zone = getLocalTimeZone();
		if (value.start && value.end) {
			return `${formatter.format(value.start.toDate(zone))} – ${formatter.format(value.end.toDate(zone))}`;
		}
		if (value.start) {
			return formatter.format(value.start.toDate(zone));
		}
		return placeholder;
	});

	function handleValueChange(next: CalendarValue | undefined): void {
		if (!next || Array.isArray(next) || !('start' in next)) return;

		value = next;
		onValueChange?.(next);
		if (next.start && next.end) open = false;
	}
</script>

<Popover
	bind:open
	{onOpenChange}
	contentClass={cls('w-auto max-w-[calc(100vw-2rem)] overflow-x-auto p-3', contentClass)}
>
	{#snippet trigger(props)}
		<Button
			{...props}
			variant="outline"
			{disabled}
			aria-label={`${ariaLabel}: ${displayValue}`}
			class={cls('w-64 justify-start gap-2 text-left font-normal', triggerClass)}
		>
			<CalendarIcon class="size-4 shrink-0 text-muted-foreground" />
			<span class={cls('truncate', !value.start && 'text-muted-foreground')}>{displayValue}</span>
		</Button>
	{/snippet}

	<Calendar
		type="range"
		{value}
		onValueChange={handleValueChange}
		{minValue}
		{maxValue}
		{minDays}
		{maxDays}
		{numberOfMonths}
		{disabled}
		{readonly}
		{locale}
		{weekStartsOn}
		{calendarLabel}
		class={className}
	/>
</Popover>
