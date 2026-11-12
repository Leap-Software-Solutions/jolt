<script lang="ts" module>
	export type Props = {
		checked?: boolean;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		value?: string;
		label?: string;
		description?: string;
		class?: string;
		switchClass?: string;
		labelClass?: string;
		descriptionClass?: string;
		onCheckedChange?: (checked: boolean) => void;
	};
</script>

<script lang="ts">
	import { Switch as BitsSwitch } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const uid = $props.id();
	const labelId = `${uid}-label`;

	let {
		label,
		description,
		class: className,
		switchClass,
		labelClass,
		descriptionClass,
		checked = $bindable(false),
		disabled,
		required,
		name,
		value,
		onCheckedChange,
	}: Props = $props();
</script>

<label data-slot="switch" class={cls('flex items-center gap-2.5', className)}>
	<BitsSwitch.Root
		bind:checked
		{disabled}
		{required}
		{name}
		{value}
		{onCheckedChange}
		aria-labelledby={label ? labelId : undefined}
		data-slot="switch-control"
		class={cls(
			'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input transition-[color,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'data-[state=checked]:bg-primary',
			switchClass,
		)}
	>
		<BitsSwitch.Thumb
			class="pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
		/>
	</BitsSwitch.Root>

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
