<script lang="ts" generics="T">
	import Select from '../select/select.svelte';
	import Field from './field.svelte';
	import type { SelectFieldProps } from './types.js';

	const uid = $props.id();
	const selectId = `${uid}-select`;

	let {
		label,
		hint,
		error,
		items,
		value = $bindable(),
		getKey,
		onValueChange,
		placeholder,
		ariaLabel,
		disabled,
		required,
		name,
		class: className,
		triggerClass,
		contentClass,
		itemClass,
		item,
		selected,
		empty,
	}: SelectFieldProps<T> = $props();
</script>

<Field {label} {hint} {error} {required} id={selectId} class={className}>
	{#snippet children({ id, describedBy, invalid })}
		<Select
			{id}
			{describedBy}
			{invalid}
			{items}
			bind:value
			{getKey}
			{onValueChange}
			{placeholder}
			{ariaLabel}
			{disabled}
			{required}
			{name}
			{triggerClass}
			{contentClass}
			{itemClass}
			{item}
			{selected}
			{empty}
		/>
	{/snippet}
</Field>
