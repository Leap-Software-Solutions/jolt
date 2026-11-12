<script lang="ts">
	import type { DateValue } from '@internationalized/date';
	import { getLocalTimeZone, isSameDay, today } from '@internationalized/date';
	import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Calendar as BitsCalendar, RangeCalendar as BitsRangeCalendar } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import type { CalendarRange, CalendarValue, Props } from './types.js';

	let {
		type = 'single',
		value = $bindable(),
		onValueChange,
		minValue,
		maxValue,
		minDays,
		maxDays,
		disabled,
		readonly,
		numberOfMonths = 1,
		pagedNavigation,
		fixedWeeks,
		disableDaysOutsideMonth = false,
		weekStartsOn,
		weekdayFormat,
		locale,
		calendarLabel = 'Calendar',
		initialFocus,
		showToday = true,
		todayLabel = 'Today',
		class: className,
	}: Props = $props();

	const isMultiple = $derived(type === 'multiple');
	const isRange = $derived(type === 'range');
	const resolvedFixedWeeks = $derived(fixedWeeks ?? numberOfMonths > 1);
	const singleValue = $derived(
		!Array.isArray(value) && !isCalendarRange(value) ? value : undefined,
	);
	const multipleValue = $derived(Array.isArray(value) ? value : []);
	const rangeValue = $derived(
		isCalendarRange(value) ? value : { start: undefined, end: undefined },
	);
	let initialDate: DateValue | undefined;
	if (Array.isArray(value)) {
		initialDate = value[0];
	} else if (isCalendarRange(value)) {
		initialDate = value.start;
	} else {
		initialDate = value;
	}

	const todayDate = today(getLocalTimeZone());

	let placeholder = $state<DateValue>(initialDate ?? todayDate);
	let pickerOpen = $state(false);
	let pickerView = $state<'months' | 'years'>('months');
	let pickerYear = $state(initialDate?.year ?? todayDate.year);
	let pickerElement: HTMLDivElement | undefined = $state();
	let headingButton: HTMLButtonElement | undefined = $state();

	const monthShortFormatter = $derived(new Intl.DateTimeFormat(locale ?? 'en', { month: 'short' }));
	const monthLongFormatter = $derived(new Intl.DateTimeFormat(locale ?? 'en', { month: 'long' }));
	const monthOptions = $derived(
		Array.from({ length: 12 }, (_, index) => ({
			value: index + 1,
			label: monthShortFormatter.format(new Date(2000, index, 1)),
		})),
	);
	const headingLabel = $derived.by(() => {
		const firstMonth = monthLongFormatter.format(new Date(2000, placeholder.month - 1, 1));
		const last = placeholder.add({ months: Math.max(numberOfMonths - 1, 0) });
		const lastMonth = monthLongFormatter.format(new Date(2000, last.month - 1, 1));
		if (numberOfMonths <= 1) return `${firstMonth} ${placeholder.year}`;
		if (lastMonth === firstMonth && last.year === placeholder.year) {
			return `${firstMonth} ${placeholder.year}`;
		}
		if (last.year !== placeholder.year) {
			return `${firstMonth} ${placeholder.year} – ${lastMonth} ${last.year}`;
		}
		return `${firstMonth} – ${lastMonth} ${last.year}`;
	});
	const yearPageStart = $derived(pickerYear - 6);
	const yearPageLabel = $derived(`${yearPageStart} – ${yearPageStart + 11}`);
	const yearOptions = $derived(Array.from({ length: 12 }, (_, index) => yearPageStart + index));

	function isCalendarRange(next: CalendarValue | undefined): next is CalendarRange {
		return Boolean(next && !Array.isArray(next) && 'start' in next);
	}

	function isDateVisible(date: DateValue): boolean {
		const monthOffset = (date.year - placeholder.year) * 12 + (date.month - placeholder.month);
		return monthOffset >= 0 && monthOffset < numberOfMonths;
	}

	function isDateInBounds(date: DateValue): boolean {
		if (minValue && date.compare(minValue) < 0) return false;
		if (maxValue && date.compare(maxValue) > 0) return false;
		return true;
	}

	function isToday(date: DateValue): boolean {
		return isSameDay(date, todayDate);
	}

	function closePicker(): void {
		pickerOpen = false;
		pickerView = 'months';
	}

	function togglePicker(): void {
		if (pickerOpen) {
			closePicker();
			return;
		}

		pickerYear = placeholder.year;
		pickerView = 'months';
		pickerOpen = true;
	}

	function handleWindowClick(event: MouseEvent): void {
		if (!pickerOpen) return;

		const path = event.composedPath();
		if (pickerElement && path.includes(pickerElement)) return;
		if (headingButton && path.includes(headingButton)) return;

		closePicker();
	}

	function setMonth(month: number): void {
		placeholder = placeholder.set({ year: pickerYear, month });
		closePicker();
	}

	function stepPickerYear(delta: number): void {
		pickerYear += delta;
	}

	function setPickerYear(year: number): void {
		pickerYear = year;
		placeholder = placeholder.set({ year });
		pickerView = 'months';
	}

	function isSelectedMonth(month: number): boolean {
		return pickerYear === placeholder.year && month === placeholder.month;
	}

	function movePlaceholderToDate(date: DateValue): void {
		if (!isDateVisible(date)) placeholder = date;
	}

	function handleSingleValueChange(next: DateValue | undefined): void {
		value = next;
		onValueChange?.(next);
		if (next) movePlaceholderToDate(next);
	}

	function handleMultipleValueChange(next: DateValue[]): void {
		const added = next.find((date) => !multipleValue.some((current) => isSameDay(current, date)));
		value = next;
		onValueChange?.(next);
		if (added) movePlaceholderToDate(added);
	}

	function handleRangeValueChange(next: CalendarRange): void {
		const startChanged =
			next.start && (!rangeValue.start || !isSameDay(next.start, rangeValue.start));
		const endChanged = next.end && (!rangeValue.end || !isSameDay(next.end, rangeValue.end));
		let changed: DateValue | undefined;
		if (startChanged) {
			changed = next.start;
		} else if (endChanged) {
			changed = next.end;
		}

		value = next;
		onValueChange?.(next);
		if (changed) movePlaceholderToDate(changed);
	}

	function goToToday(): void {
		if (disabled) return;

		placeholder = todayDate;
		if (type === 'single' && !readonly && isDateInBounds(todayDate)) {
			handleSingleValueChange(todayDate);
		}
	}

	type CalendarMonth = {
		value: DateValue;
		weeks: DateValue[][];
	};
</script>

{#snippet renderHeader()}
	<div class="relative flex items-center justify-between gap-1">
		<BitsCalendar.PrevButton
			class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		>
			<ChevronLeftIcon class="size-4" />
		</BitsCalendar.PrevButton>
		<button
			type="button"
			bind:this={headingButton}
			aria-expanded={pickerOpen}
			aria-label={`${headingLabel}: choose month and year`}
			class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
			onclick={togglePicker}
		>
			{headingLabel}
			<ChevronDownIcon
				class={cls(
					'size-3.5 text-muted-foreground transition-transform',
					pickerOpen && 'rotate-180',
				)}
			/>
		</button>
		<BitsCalendar.NextButton
			class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		>
			<ChevronRightIcon class="size-4" />
		</BitsCalendar.NextButton>

		{#if pickerOpen}
			<div
				bind:this={pickerElement}
				data-slot="calendar-picker"
				class="absolute inset-x-0 top-full z-20 mt-2 rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
			>
				{#if pickerView === 'months'}
					<div class="flex items-center justify-between gap-2 px-1">
						<button
							type="button"
							aria-label="Previous year"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepPickerYear(-1)}
						>
							<ChevronLeftIcon class="size-3.5" />
						</button>
						<button
							type="button"
							aria-label={`${pickerYear}: choose year`}
							class="rounded-md px-2 py-1 text-sm font-medium tabular-nums transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => (pickerView = 'years')}
						>
							{pickerYear}
						</button>
						<button
							type="button"
							aria-label="Next year"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepPickerYear(1)}
						>
							<ChevronRightIcon class="size-3.5" />
						</button>
					</div>
					<div class="mt-2 grid grid-cols-3 gap-1">
						{#each monthOptions as month (month.value)}
							<button
								type="button"
								aria-pressed={isSelectedMonth(month.value)}
								class={cls(
									'rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
									isSelectedMonth(month.value) &&
										'bg-primary text-primary-foreground hover:bg-primary/90',
								)}
								onclick={() => setMonth(month.value)}
							>
								{month.label}
							</button>
						{/each}
					</div>
				{:else}
					<div class="flex items-center justify-between gap-2 px-1">
						<button
							type="button"
							aria-label="Previous 12 years"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepPickerYear(-12)}
						>
							<ChevronLeftIcon class="size-3.5" />
						</button>
						<button
							type="button"
							aria-label={`${yearPageLabel}: show months`}
							class="rounded-md px-2 py-1 text-sm font-medium tabular-nums transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => (pickerView = 'months')}
						>
							{yearPageLabel}
						</button>
						<button
							type="button"
							aria-label="Next 12 years"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepPickerYear(12)}
						>
							<ChevronRightIcon class="size-3.5" />
						</button>
					</div>
					<div class="mt-2 grid grid-cols-3 gap-1">
						{#each yearOptions as year (year)}
							<button
								type="button"
								aria-pressed={year === pickerYear}
								class={cls(
									'rounded-md px-2 py-1.5 text-xs tabular-nums transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
									year === pickerYear && 'bg-primary text-primary-foreground hover:bg-primary/90',
								)}
								onclick={() => setPickerYear(year)}
							>
								{year}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet renderCalendar(months: CalendarMonth[], weekdays: string[])}
	<div class="flex flex-col gap-4 sm:flex-row">
		{#each months as month (month.value.toString())}
			<div class="grid">
				<BitsCalendar.Grid
					class="w-full border-separate border-spacing-1 cursor-default select-none"
				>
					<BitsCalendar.GridHead>
						<BitsCalendar.GridRow>
							{#each weekdays as weekday, index (index)}
								<BitsCalendar.HeadCell
									class="w-8 text-center text-xs font-normal text-muted-foreground select-none"
								>
									{weekday}
								</BitsCalendar.HeadCell>
							{/each}
						</BitsCalendar.GridRow>
					</BitsCalendar.GridHead>
					<BitsCalendar.GridBody>
						{#each month.weeks as week, weekIndex (weekIndex)}
							<BitsCalendar.GridRow>
								{#each week as day (day.toString())}
									<BitsCalendar.Cell
										date={day}
										month={month.value}
										class="relative p-0 text-center text-sm select-none"
									>
										<BitsCalendar.Day
											aria-current={isToday(day) ? 'date' : undefined}
											class="relative z-10 flex size-8 cursor-default items-center justify-center rounded-md text-sm transition-colors select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-0.5 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-brand data-[today]:after:content-[''] data-[unavailable]:text-destructive data-[unavailable]:line-through"
										/>
									</BitsCalendar.Cell>
								{/each}
							</BitsCalendar.GridRow>
						{/each}
					</BitsCalendar.GridBody>
				</BitsCalendar.Grid>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet renderRangeCalendar(months: CalendarMonth[], weekdays: string[])}
	<div class="flex flex-col gap-4 sm:flex-row">
		{#each months as month (month.value.toString())}
			<div class="grid">
				<BitsRangeCalendar.Grid
					class="w-full border-separate border-spacing-1 cursor-default select-none"
				>
					<BitsRangeCalendar.GridHead>
						<BitsRangeCalendar.GridRow>
							{#each weekdays as weekday, index (index)}
								<BitsRangeCalendar.HeadCell
									class="w-8 text-center text-xs font-normal text-muted-foreground select-none"
								>
									{weekday}
								</BitsRangeCalendar.HeadCell>
							{/each}
						</BitsRangeCalendar.GridRow>
					</BitsRangeCalendar.GridHead>
					<BitsRangeCalendar.GridBody>
						{#each month.weeks as week, weekIndex (weekIndex)}
							<BitsRangeCalendar.GridRow>
								{#each week as day (day.toString())}
									<BitsRangeCalendar.Cell
										date={day}
										month={month.value}
										class="relative p-0 text-center text-sm select-none data-[range-end]:before:absolute data-[range-end]:before:inset-y-0 data-[range-end]:before:-left-0.5 data-[range-end]:before:w-0.5 data-[range-end]:before:bg-foreground/15 data-[range-end]:before:content-[''] data-[range-middle]:before:absolute data-[range-middle]:before:-inset-x-0.5 data-[range-middle]:before:inset-y-0 data-[range-middle]:before:bg-foreground/15 data-[range-middle]:before:content-[''] data-[range-start]:before:absolute data-[range-start]:before:inset-y-0 data-[range-start]:before:-right-0.5 data-[range-start]:before:w-0.5 data-[range-start]:before:bg-foreground/15 data-[range-start]:before:content-[''] data-[range-start]:data-[range-end]:before:hidden"
									>
										<BitsRangeCalendar.Day
											aria-current={isToday(day) ? 'date' : undefined}
											class="relative z-10 flex size-8 cursor-default items-center justify-center rounded-md text-sm transition-colors select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[range-end]:rounded-s-none data-[range-end]:rounded-e-md data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-middle]:rounded-none data-[range-middle]:bg-transparent data-[range-middle]:text-foreground data-[range-start]:rounded-s-md data-[range-start]:rounded-e-none data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[range-start]:data-[range-end]:rounded-md data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-0.5 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-brand data-[today]:after:content-[''] data-[unavailable]:text-destructive data-[unavailable]:line-through"
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

{#snippet renderFooter()}
	{#if showToday}
		<div class="mt-2 flex justify-center border-t pt-2">
			<Button
				variant="link"
				size="sm"
				type="button"
				{disabled}
				onclick={goToToday}
				class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
			>
				{todayLabel}
			</Button>
		</div>
	{/if}
{/snippet}

<svelte:window onclick={handleWindowClick} />

{#if isRange}
	<BitsRangeCalendar.Root
		value={rangeValue}
		onValueChange={handleRangeValueChange}
		{minValue}
		{maxValue}
		{minDays}
		{maxDays}
		{disabled}
		{readonly}
		{numberOfMonths}
		{pagedNavigation}
		fixedWeeks={resolvedFixedWeeks}
		{disableDaysOutsideMonth}
		{weekStartsOn}
		{weekdayFormat}
		{locale}
		{calendarLabel}
		bind:placeholder
		data-slot="calendar"
		class={cls('relative rounded-md', className)}
	>
		{#snippet children({ months, weekdays })}
			{@render renderHeader()}
			{@render renderRangeCalendar(months, weekdays)}
			{@render renderFooter()}
		{/snippet}
	</BitsRangeCalendar.Root>
{:else if isMultiple}
	<BitsCalendar.Root
		type="multiple"
		value={multipleValue}
		onValueChange={handleMultipleValueChange}
		{minValue}
		{maxValue}
		{disabled}
		{readonly}
		{numberOfMonths}
		{pagedNavigation}
		fixedWeeks={resolvedFixedWeeks}
		{disableDaysOutsideMonth}
		{weekStartsOn}
		{weekdayFormat}
		{locale}
		{calendarLabel}
		{initialFocus}
		bind:placeholder
		data-slot="calendar"
		class={cls('relative rounded-md', className)}
	>
		{#snippet children({ months, weekdays })}
			{@render renderHeader()}
			{@render renderCalendar(months, weekdays)}
			{@render renderFooter()}
		{/snippet}
	</BitsCalendar.Root>
{:else}
	<BitsCalendar.Root
		type="single"
		value={singleValue}
		onValueChange={handleSingleValueChange}
		{minValue}
		{maxValue}
		{disabled}
		{readonly}
		{numberOfMonths}
		{pagedNavigation}
		fixedWeeks={resolvedFixedWeeks}
		{disableDaysOutsideMonth}
		{weekStartsOn}
		{weekdayFormat}
		{locale}
		{calendarLabel}
		{initialFocus}
		bind:placeholder
		data-slot="calendar"
		class={cls('relative rounded-md', className)}
	>
		{#snippet children({ months, weekdays })}
			{@render renderHeader()}
			{@render renderCalendar(months, weekdays)}
			{@render renderFooter()}
		{/snippet}
	</BitsCalendar.Root>
{/if}
