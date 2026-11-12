<script lang="ts">
	import { Time } from '@internationalized/date';
	import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from '@lucide/svelte';
	import { TimeField as BitsTimeField } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Popover } from '../popover/index.js';
	import type { Props } from './types.js';

	let {
		value = $bindable(),
		onValueChange,
		minValue,
		maxValue,
		label,
		ariaLabel,
		hint,
		error,
		disabled,
		readonly,
		required,
		name,
		locale,
		hourCycle,
		granularity,
		class: className,
		inputClass,
		labelClass,
		segmentClass,
	}: Props = $props();

	const uid = $props.id();
	const inputId = `${uid}-input`;
	const labelId = `${uid}-label`;
	const hintId = `${uid}-hint`;
	const errorId = `${uid}-error`;

	const hasError = $derived(Boolean(error));
	const describedBy = $derived(
		[hint && !error ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined,
	);

	const hour = $derived(value?.hour ?? 0);
	const minute = $derived(value?.minute ?? 0);
	const second = $derived(value?.second ?? 0);
	const is12Hour = $derived(hourCycle === 12);
	const showMinutes = $derived(granularity !== 'hour');
	const showSeconds = $derived(granularity === 'second');
	const displayHour = $derived(is12Hour ? (hour % 12 === 0 ? 12 : hour % 12) : hour);
	const period = $derived(hour < 12 ? 'AM' : 'PM');

	function setTime(nextHour: number, nextMinute: number, nextSecond = second): void {
		const nextValue = new Time(
			(nextHour + 24) % 24,
			(nextMinute + 60) % 60,
			(nextSecond + 60) % 60,
			value?.millisecond ?? 0,
		);

		value = nextValue;
		onValueChange?.(nextValue);
	}

	function stepHour(delta: number): void {
		setTime(hour + delta, minute);
	}

	function stepMinute(delta: number): void {
		setTime(hour, minute + delta);
	}

	function stepSecond(delta: number): void {
		setTime(hour, minute, second + delta);
	}

	function togglePeriod(): void {
		setTime(hour < 12 ? hour + 12 : hour - 12, minute);
	}

	function formatNumber(next: number): string {
		return String(next).padStart(2, '0');
	}
</script>

<div data-slot="time-picker" class={cls('grid gap-1.5', className)}>
	{#if label}
		<label id={labelId} for={inputId} class={cls('text-sm font-medium', labelClass)}>
			{label}
		</label>
	{/if}

	<div class="relative">
		<BitsTimeField.Root
			bind:value
			{onValueChange}
			{minValue}
			{maxValue}
			{disabled}
			{readonly}
			{required}
			{locale}
			{hourCycle}
			{granularity}
			errorMessageId={hasError ? errorId : undefined}
		>
			<BitsTimeField.Input
				id={inputId}
				{name}
				aria-labelledby={label ? labelId : undefined}
				aria-label={label ? undefined : (ariaLabel ?? 'Time')}
				aria-describedby={describedBy}
				aria-invalid={hasError || undefined}
				data-slot="time-picker-input"
				class={cls(
					'flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 pe-9 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
					'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
					hasError && 'border-destructive focus-within:ring-destructive',
					disabled && 'cursor-not-allowed opacity-50',
					inputClass,
				)}
			>
				{#snippet children({ segments })}
					{#each segments as segment, index (index)}
						{#if segment.part === 'literal'}
							<span class="text-muted-foreground">{segment.value}</span>
						{:else}
							<BitsTimeField.Segment
								part={segment.part}
								class={cls(
									'rounded-sm px-0.5 text-center tabular-nums outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground',
									segmentClass,
								)}
							>
								{segment.value}
							</BitsTimeField.Segment>
						{/if}
					{/each}
				{/snippet}
			</BitsTimeField.Input>
		</BitsTimeField.Root>

		<Popover
			align="end"
			contentClass={cls(showSeconds ? 'w-72 p-3' : showMinutes ? 'w-56 p-3' : 'w-48 p-3')}
		>
			{#snippet trigger(props)}
				<Button
					{...props}
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Choose time"
					disabled={disabled || readonly}
					class="absolute end-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
				>
					<ClockIcon class="size-4" />
				</Button>
			{/snippet}

			<div data-slot="time-picker-popover" class="grid gap-3">
				<p class="text-sm font-medium">Choose time</p>
				<div class="flex items-center justify-center gap-4">
					<div class="grid justify-items-center gap-1">
						<button
							type="button"
							aria-label="Increase hour"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepHour(1)}
						>
							<ChevronUpIcon class="size-4" />
						</button>
						<span class="text-2xl font-semibold tabular-nums">{formatNumber(displayHour)}</span>
						<button
							type="button"
							aria-label="Decrease hour"
							class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={() => stepHour(-1)}
						>
							<ChevronDownIcon class="size-4" />
						</button>
						<span class="text-xs text-muted-foreground">Hour</span>
					</div>

					{#if showMinutes}
						<span class="text-2xl text-muted-foreground">:</span>

						<div class="grid justify-items-center gap-1">
							<button
								type="button"
								aria-label="Increase minute"
								class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
								onclick={() => stepMinute(1)}
							>
								<ChevronUpIcon class="size-4" />
							</button>
							<span class="text-2xl font-semibold tabular-nums">{formatNumber(minute)}</span>
							<button
								type="button"
								aria-label="Decrease minute"
								class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
								onclick={() => stepMinute(-1)}
							>
								<ChevronDownIcon class="size-4" />
							</button>
							<span class="text-xs text-muted-foreground">Minute</span>
						</div>
					{/if}

					{#if showSeconds}
						<span class="text-2xl text-muted-foreground">:</span>

						<div class="grid justify-items-center gap-1">
							<button
								type="button"
								aria-label="Increase second"
								class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
								onclick={() => stepSecond(1)}
							>
								<ChevronUpIcon class="size-4" />
							</button>
							<span class="text-2xl font-semibold tabular-nums">{formatNumber(second)}</span>
							<button
								type="button"
								aria-label="Decrease second"
								class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
								onclick={() => stepSecond(-1)}
							>
								<ChevronDownIcon class="size-4" />
							</button>
							<span class="text-xs text-muted-foreground">Second</span>
						</div>
					{/if}

					{#if is12Hour}
						<button
							type="button"
							aria-label="Toggle AM/PM"
							class="self-center rounded-md border px-2 py-1 text-xs font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
							onclick={togglePeriod}
						>
							{period}
						</button>
					{/if}
				</div>
			</div>
		</Popover>
	</div>

	{#if hint && !error}
		<p id={hintId} class="text-xs text-muted-foreground">{hint}</p>
	{/if}
	{#if error}
		<p id={errorId} role="alert" class="text-xs text-destructive">{error}</p>
	{/if}
</div>
