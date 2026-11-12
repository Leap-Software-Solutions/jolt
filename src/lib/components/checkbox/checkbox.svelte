<script lang="ts" module>
	export type Props = {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		value?: string;
		label?: string;
		description?: string;
		class?: string;
		labelClass?: string;
		descriptionClass?: string;
		onCheckedChange?: (checked: boolean) => void;
		onIndeterminateChange?: (indeterminate: boolean) => void;
	};
</script>

<script lang="ts">
	import { CheckIcon, MinusIcon } from '@lucide/svelte';
	import { Checkbox as BitsCheckbox } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const uid = $props.id();
	const labelId = `${uid}-label`;

	let {
		label,
		description,
		class: className,
		labelClass,
		descriptionClass,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled,
		required,
		name,
		value,
		onCheckedChange,
		onIndeterminateChange,
	}: Props = $props();
</script>

<label data-slot="checkbox" class={cls('flex items-start gap-2.5', className)}>
	<BitsCheckbox.Root
		bind:checked
		bind:indeterminate
		{disabled}
		{required}
		{name}
		{value}
		{onCheckedChange}
		{onIndeterminateChange}
		aria-labelledby={label ? labelId : undefined}
		data-slot="checkbox-control"
		class={cls(
			'peer mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background text-primary-foreground shadow-xs transition-[color,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
			'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
		)}
	>
		{#snippet children({ checked, indeterminate })}
			{#if indeterminate}
				<MinusIcon class="size-3.5" />
			{:else if checked}
				<CheckIcon class="size-3.5" />
			{/if}
		{/snippet}
	</BitsCheckbox.Root>

	{#if label || description}
		<span class="flex min-w-0 flex-col gap-0.5">
			{#if label}
				<span id={labelId} class={cls('text-sm leading-tight font-medium', labelClass)}>
					{label}
				</span>
			{/if}
			{#if description}
				<span class={cls('text-xs text-muted-foreground', descriptionClass)}>
					{description}
				</span>
			{/if}
		</span>
	{/if}
</label>
