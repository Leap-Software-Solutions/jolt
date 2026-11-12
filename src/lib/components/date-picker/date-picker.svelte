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
	import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Calendar as BitsCalendar } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
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

	function handleValueChange(next: DateValue | undefined): void {
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
		<BitsCalendar.Root
			type="single"
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
			class={cls('rounded-md', className)}
		>
			{#snippet children({ months, weekdays })}
				{#each months as month (month.value.toString())}
					<div class="grid gap-3">
						<BitsCalendar.Header class="flex items-center justify-between pt-1">
							<BitsCalendar.PrevButton
								class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
							>
								<ChevronLeftIcon class="size-4" />
							</BitsCalendar.PrevButton>
							<BitsCalendar.Heading class="text-sm font-medium" />
							<BitsCalendar.NextButton
								class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
							>
								<ChevronRightIcon class="size-4" />
							</BitsCalendar.NextButton>
						</BitsCalendar.Header>

						<BitsCalendar.Grid class="w-full border-collapse">
							<BitsCalendar.GridHead>
								<BitsCalendar.GridRow class="flex">
									{#each weekdays as weekday (weekday)}
										<BitsCalendar.HeadCell
											class="w-8 text-center text-xs font-normal text-muted-foreground"
										>
											{weekday}
										</BitsCalendar.HeadCell>
									{/each}
								</BitsCalendar.GridRow>
							</BitsCalendar.GridHead>
							<BitsCalendar.GridBody>
								{#each month.weeks as week, weekIndex (weekIndex)}
									<BitsCalendar.GridRow class="mt-1 flex w-full">
										{#each week as day (day.toString())}
											<BitsCalendar.Cell
												date={day}
												month={month.value}
												class="relative p-0 text-center text-sm"
											>
												<BitsCalendar.Day
													class="flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[today]:font-semibold data-[unavailable]:text-destructive data-[unavailable]:line-through"
												/>
											</BitsCalendar.Cell>
										{/each}
									</BitsCalendar.GridRow>
								{/each}
							</BitsCalendar.GridBody>
						</BitsCalendar.Grid>
					</div>
				{/each}
			{/snippet}
		</BitsCalendar.Root>
	{/snippet}
</Popover>
