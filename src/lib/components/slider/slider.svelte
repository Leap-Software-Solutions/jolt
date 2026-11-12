<script lang="ts" module>
	export type SliderType = 'single' | 'multiple';
	export type SliderOrientation = 'horizontal' | 'vertical';

	export type Props = {
		type?: SliderType;
		value?: number | number[];
		onValueChange?: (value: number | number[]) => void;
		onValueCommit?: (value: number | number[]) => void;
		min?: number;
		max?: number;
		step?: number | number[];
		orientation?: SliderOrientation;
		disabled?: boolean;
		label?: string;
		ariaLabel?: string;
		showValue?: boolean;
		formatValue?: (value: number | number[]) => string;
		class?: string;
		rangeClass?: string;
		thumbClass?: string;
		labelClass?: string;
		valueClass?: string;
	};
</script>

<script lang="ts">
	import { Slider as BitsSlider } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const uid = $props.id();
	const labelId = `${uid}-label`;

	let {
		type = 'single',
		value = $bindable(),
		onValueChange,
		onValueCommit,
		min,
		max,
		step,
		orientation = 'horizontal',
		disabled,
		label,
		ariaLabel,
		showValue = false,
		formatValue,
		class: className,
		rangeClass,
		thumbClass,
		labelClass,
		valueClass,
	}: Props = $props();

	const minValue = $derived(min ?? 0);
	const maxValue = $derived(max ?? 100);
	const isVertical = $derived(orientation === 'vertical');
	const isMultiple = $derived(type === 'multiple');

	const singleValue = $derived(typeof value === 'number' ? value : minValue);
	const multipleValue = $derived(Array.isArray(value) ? value : [minValue, maxValue]);

	const currentValue = $derived(isMultiple ? multipleValue : singleValue);

	function formatSliderValue(nextValue: number | number[]): string {
		if (formatValue) return formatValue(nextValue);
		if (Array.isArray(nextValue)) return nextValue.join(' – ');
		return String(nextValue);
	}

	const displayValue = $derived(formatSliderValue(currentValue));

	function handleSingleValueChange(next: number): void {
		value = next;
		onValueChange?.(next);
	}

	function handleMultipleValueChange(next: number[]): void {
		value = next;
		onValueChange?.(next);
	}

	function handleSingleValueCommit(next: number): void {
		onValueCommit?.(next);
	}

	function handleMultipleValueCommit(next: number[]): void {
		onValueCommit?.(next);
	}

	function getThumbLabel(index: number): string {
		const base = label ?? ariaLabel ?? 'Slider';
		return isMultiple ? `${base} ${index + 1}` : base;
	}
</script>

<div data-slot="slider" class={cls('grid w-full gap-2', className)}>
	{#if label || showValue}
		<div class="flex items-center justify-between gap-4">
			{#if label}
				<span id={labelId} class={cls('text-sm font-medium', labelClass)}>{label}</span>
			{/if}
			{#if showValue}
				<span class={cls('text-xs text-muted-foreground tabular-nums', valueClass)}>
					{displayValue}
				</span>
			{/if}
		</div>
	{/if}

	{#if isMultiple}
		<BitsSlider.Root
			type="multiple"
			value={multipleValue}
			onValueChange={handleMultipleValueChange}
			onValueCommit={handleMultipleValueCommit}
			{min}
			{max}
			{step}
			{orientation}
			{disabled}
			aria-labelledby={label ? labelId : undefined}
			aria-label={label ? undefined : ariaLabel}
			data-slot="slider-root"
			class={cls(
				'relative flex touch-none items-center rounded-full bg-muted select-none data-[disabled]:opacity-50',
				isVertical ? 'h-40 w-1.5 justify-self-center' : 'h-1.5 w-full',
			)}
		>
			{#snippet children({ thumbItems })}
				<BitsSlider.Range
					data-slot="slider-range"
					class={cls(
						'absolute rounded-full bg-primary',
						isVertical ? 'w-full' : 'h-full',
						rangeClass,
					)}
				/>
				{#each thumbItems as thumb (thumb.index)}
					<BitsSlider.Thumb
						index={thumb.index}
						aria-label={getThumbLabel(thumb.index)}
						data-slot="slider-thumb"
						class={cls(
							'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
							isVertical && 'left-1/2 [transform:translateX(-50%)]',
							thumbClass,
						)}
					/>
				{/each}
			{/snippet}
		</BitsSlider.Root>
	{:else}
		<BitsSlider.Root
			type="single"
			value={singleValue}
			onValueChange={handleSingleValueChange}
			onValueCommit={handleSingleValueCommit}
			{min}
			{max}
			{step}
			{orientation}
			{disabled}
			aria-labelledby={label ? labelId : undefined}
			aria-label={label ? undefined : ariaLabel}
			data-slot="slider-root"
			class={cls(
				'relative flex touch-none items-center rounded-full bg-muted select-none data-[disabled]:opacity-50',
				isVertical ? 'h-40 w-1.5 justify-self-center' : 'h-1.5 w-full',
			)}
		>
			<BitsSlider.Range
				data-slot="slider-range"
				class={cls(
					'absolute rounded-full bg-primary',
					isVertical ? 'w-full' : 'h-full',
					rangeClass,
				)}
			/>
			<BitsSlider.Thumb
				index={0}
				aria-label={getThumbLabel(0)}
				data-slot="slider-thumb"
				class={cls(
					'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
					isVertical && 'left-1/2 [transform:translateX(-50%)]',
					thumbClass,
				)}
			/>
		</BitsSlider.Root>
	{/if}
</div>
