<script lang="ts">
	import { cls } from '../../utils/index.js';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { CheckboxFieldProps } from './types.js';

	const uid = $props.id();
	const errorId = `${uid}-error`;

	let {
		label,
		description,
		error,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled,
		required,
		name,
		value,
		class: className,
		labelClass,
		descriptionClass,
		errorClass,
		onCheckedChange,
		onIndeterminateChange,
	}: CheckboxFieldProps = $props();
</script>

<div data-slot="checkbox-field" class={cls('grid gap-1.5', className)}>
	<Checkbox
		bind:checked
		bind:indeterminate
		{label}
		{description}
		{disabled}
		{required}
		{name}
		{value}
		{onCheckedChange}
		{onIndeterminateChange}
		describedBy={error ? errorId : undefined}
		invalid={Boolean(error)}
		{labelClass}
		{descriptionClass}
	/>
	{#if error}
		<p id={errorId} role="alert" class={cls('text-xs text-destructive', errorClass)}>
			{error}
		</p>
	{/if}
</div>
