<script lang="ts" module>
	export type Props = {
		value?: number | null;
		min?: number;
		max?: number;
		label?: string;
		ariaLabel?: string;
		showValue?: boolean;
		formatValue?: (value: number) => string;
		class?: string;
		barClass?: string;
		labelClass?: string;
		valueClass?: string;
	};
</script>

<script lang="ts">
	import { Progress as BitsProgress } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const uid = $props.id();
	const labelId = `${uid}-label`;

	let {
		value = 0,
		min = 0,
		max = 100,
		label,
		ariaLabel,
		showValue = false,
		formatValue,
		class: className,
		barClass,
		labelClass,
		valueClass,
	}: Props = $props();

	const isIndeterminate = $derived(value === null);
	const percent = $derived.by(() => {
		if (value === null || max <= min) return 0;
		return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
	});
	const displayValue = $derived(
		formatValue && value !== null ? formatValue(value) : `${Math.round(percent)}%`,
	);
</script>

<div data-slot="progress" class={cls('grid w-full gap-2', className)}>
	{#if label || showValue}
		<div class="flex items-center justify-between gap-4">
			{#if label}
				<span id={labelId} class={cls('text-sm font-medium', labelClass)}>{label}</span>
			{/if}
			{#if showValue && !isIndeterminate}
				<span class={cls('text-xs text-muted-foreground tabular-nums', valueClass)}>
					{displayValue}
				</span>
			{/if}
		</div>
	{/if}

	<BitsProgress.Root
		{value}
		{min}
		{max}
		aria-labelledby={label ? labelId : undefined}
		aria-label={label ? undefined : (ariaLabel ?? 'Progress')}
		data-slot="progress-root"
		class="relative h-2 w-full overflow-hidden rounded-full bg-muted"
	>
		<div
			data-slot="progress-bar"
			class={cls(
				'h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none',
				isIndeterminate && 'w-1/2 animate-pulse',
				barClass,
			)}
			style:width={isIndeterminate ? undefined : `${percent}%`}
		></div>
	</BitsProgress.Root>
</div>
