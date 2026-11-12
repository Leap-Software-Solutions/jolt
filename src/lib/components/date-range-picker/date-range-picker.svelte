<script lang="ts" module>
	import type { DateValue } from '@internationalized/date';

	export type DateRangeValue = {
		start: DateValue | undefined;
		end: DateValue | undefined;
	};

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
	import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { RangeCalendar as BitsRangeCalendar } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
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
	const monthFormatter = $derived(new DateFormatter(locale, { month: 'long', year: 'numeric' }));
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

	function handleValueChange(next: DateRangeValue): void {
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

	{#snippet content()}
		<BitsRangeCalendar.Root
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
			class={cls('rounded-md', className)}
		>
			{#snippet children({ months, weekdays })}
				<div class="flex flex-col gap-4 sm:flex-row">
					{#each months as month (month.value.toString())}
						<div class="grid gap-3">
							<BitsRangeCalendar.Header class="flex items-center justify-between pt-1">
								<BitsRangeCalendar.PrevButton
									class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
								>
									<ChevronLeftIcon class="size-4" />
								</BitsRangeCalendar.PrevButton>
								<span class="text-sm font-medium"
									>{monthFormatter.format(month.value.toDate(getLocalTimeZone()))}</span
								>
								<BitsRangeCalendar.NextButton
									class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
								>
									<ChevronRightIcon class="size-4" />
								</BitsRangeCalendar.NextButton>
							</BitsRangeCalendar.Header>

							<BitsRangeCalendar.Grid class="w-full border-collapse">
								<BitsRangeCalendar.GridHead>
									<BitsRangeCalendar.GridRow class="flex">
										{#each weekdays as weekday (weekday)}
											<BitsRangeCalendar.HeadCell
												class="w-8 text-center text-xs font-normal text-muted-foreground"
											>
												{weekday}
											</BitsRangeCalendar.HeadCell>
										{/each}
									</BitsRangeCalendar.GridRow>
								</BitsRangeCalendar.GridHead>
								<BitsRangeCalendar.GridBody>
									{#each month.weeks as week, weekIndex (weekIndex)}
										<BitsRangeCalendar.GridRow class="mt-1 flex w-full">
											{#each week as day (day.toString())}
												<BitsRangeCalendar.Cell
													date={day}
													month={month.value}
													class="relative p-0 text-center text-sm"
												>
													<BitsRangeCalendar.Day
														class="flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 data-[range-end]:rounded-r-md data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-middle]:bg-accent data-[range-middle]:text-accent-foreground data-[range-start]:rounded-l-md data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[today]:font-semibold data-[unavailable]:text-destructive data-[unavailable]:line-through"
													/>
												</BitsRangeCalendar.Cell>
											{/each}
										</BitsRangeCalendar.GridRow>
									{/each}
								</BitsRangeCalendar.GridBody>
							</BitsRangeCalendar.Grid>
						</div>
					{/each}
				</div>
			{/snippet}
		</BitsRangeCalendar.Root>
	{/snippet}
</Popover>
