<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';
	import Input from '../input/input.svelte';
	import Field from './field.svelte';
	import type { TextFieldProps } from './types.js';

	const uid = $props.id();
	const inputId = `${uid}-input`;

	let {
		label,
		hint,
		error,
		value = $bindable(''),
		type = 'text',
		placeholder,
		name,
		disabled,
		required,
		readonly,
		autocomplete,
		maxlength,
		ariaLabel,
		class: className,
		inputClass,
	}: TextFieldProps = $props();
</script>

<Field {label} {hint} {error} {required} id={inputId} class={className}>
	{#snippet children({ id, describedBy, invalid })}
		<Input
			{id}
			bind:value
			{type}
			{placeholder}
			{name}
			{disabled}
			{required}
			{readonly}
			autocomplete={autocomplete as FullAutoFill | undefined}
			{maxlength}
			aria-label={label ? undefined : ariaLabel}
			aria-describedby={describedBy}
			aria-invalid={invalid || undefined}
			class={inputClass}
		/>
	{/snippet}
</Field>
