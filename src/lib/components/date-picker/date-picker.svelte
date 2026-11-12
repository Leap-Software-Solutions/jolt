<script lang="ts" module>
	import type { DateValue } from '@internationalized/date';

	export type DatePickerValue = DateValue;
	export type DatePickerWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

	export type Props = {
		value?: DateValue;
		onValueChange?: (value: DateValue | undefined) => void;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placeholder?: string;
		ariaLabel?: string;
		calendarLabel?: string;
		minValue?: DateValue;
		maxValue?: DateValue;
		disabled?: boolean;
		readonly?: boolean;
		locale?: string;
		weekStartsOn?: DatePickerWeekStartsOn;
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
		value = $bindable(),
		onValueChange,
		open = $bindable(false),
		onOpenChange,
		placeholder = 'Pick a date',
		ariaLabel = 'Choose a date',
		calendarLabel = 'Choose a date',
		minValue,
		maxValue,
		disabled,
		readonly,
		locale = 'en',
		weekStartsOn,
		class: className,
		triggerClass,
		contentClass,
	}: Props = $props();

	const formatter = $derived(new DateFormatter(locale, { dateStyle: 'medium' }));
	const displayValue = $derived(
		value ? formatter.format(value.toDate(getLocalTimeZone())) : placeholder,
	);

	function handleValueChange(next: DateValue | DateValue[] | undefined): void {
		if (Array.isArray(next)) return;
		value = next;
		onValueChange?.(next);
		if (next) open = false;
	}
</script>

<Popover bind:open {onOpenChange} contentClass={cls('w-auto p-3', contentClass)}>
	{#snippet trigger(props)}
		<Button
			{...props}
			variant="outline"
			{disabled}
			aria-label={`${ariaLabel}: ${displayValue}`}
			class={cls('w-56 justify-start gap-2 text-left font-normal', triggerClass)}
		>
			<CalendarIcon class="size-4 text-muted-foreground" />
			<span class={cls(!value && 'text-muted-foreground')}>{displayValue}</span>
		</Button>
	{/snippet}

	{#snippet content()}
		<Calendar
			{value}
			onValueChange={handleValueChange}
			{minValue}
			{maxValue}
			{disabled}
			{readonly}
			{locale}
			{weekStartsOn}
			{calendarLabel}
			initialFocus
			class={className}
		/>
	{/snippet}
</Popover>
