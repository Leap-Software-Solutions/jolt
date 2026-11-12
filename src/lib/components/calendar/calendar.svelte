<script lang="ts">
	import type { DateValue } from '@internationalized/date';
	import { getLocalTimeZone, isSameDay, today } from '@internationalized/date';
	import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Calendar as BitsCalendar } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	let {
		type = 'single',
		value = $bindable(),
		onValueChange,
		minValue,
		maxValue,
		disabled,
		readonly,
		numberOfMonths = 1,
		pagedNavigation,
		fixedWeeks,
		weekStartsOn,
		weekdayFormat,
		locale,
		calendarLabel = 'Calendar',
		initialFocus,
		class: className,
	}: Props = $props();

	const isMultiple = $derived(type === 'multiple');
	const resolvedFixedWeeks = $derived(fixedWeeks ?? numberOfMonths > 1);
	const singleValue = $derived(Array.isArray(value) ? undefined : value);
	const multipleValue = $derived(Array.isArray(value) ? value : []);
	const initialDate = Array.isArray(value) ? value[0] : value;
	let placeholder = $state<DateValue>(initialDate ?? today(getLocalTimeZone()));
	let pickerOpen = $state(false);
	let pickerView = $state<'months' | 'years'>('months');
	let pickerYear = $state(initialDate?.year ?? today(getLocalTimeZone()).year);
	let pickerElement: HTMLDivElement | undefined = $state();
	let headingButton: HTMLButtonElement | undefined = $state();
	const todayDate = today(getLocalTimeZone());

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
		if (lastMonth === firstMonth) return `${firstMonth} ${placeholder.year}`;
		return `${firstMonth} – ${lastMonth} ${last.year}`;
	});
	const yearPageStart = $derived(pickerYear - 6);
	const yearPageLabel = $derived(`${yearPageStart} – ${yearPageStart + 11}`);
	const yearOptions = $derived(Array.from({ length: 12 }, (_, index) => yearPageStart + index));

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
		pickerOpen = false;
		pickerView = 'months';
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

	function handleSingleValueChange(next: DateValue | undefined): void {
		value = next;
		onValueChange?.(next);
	}

	function handleMultipleValueChange(next: DateValue[]): void {
		value = next;
		onValueChange?.(next);
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
											class="flex size-8 cursor-default items-center justify-center rounded-md text-sm transition-colors select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[today]:font-semibold data-[today]:ring-1 data-[today]:ring-brand data-[today]:ring-inset data-[unavailable]:text-destructive data-[unavailable]:line-through"
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

<svelte:window onclick={handleWindowClick} />

{#if isMultiple}
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
		{/snippet}
	</BitsCalendar.Root>
{/if}
