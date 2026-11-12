<script lang="ts">
	import Textarea from '../textarea/textarea.svelte';
	import Field from './field.svelte';
	import type { TextareaFieldProps } from './types.js';

	const uid = $props.id();
	const textareaId = `${uid}-textarea`;

	let {
		label,
		hint,
		error,
		value = $bindable(''),
		placeholder,
		name,
		rows = 3,
		disabled,
		required,
		readonly,
		maxlength,
		ariaLabel,
		class: className,
		textareaClass,
	}: TextareaFieldProps = $props();
</script>

<Field {label} {hint} {error} {required} id={textareaId} class={className}>
	{#snippet children({ id, describedBy, invalid })}
		<Textarea
			{id}
			bind:value
			{placeholder}
			{name}
			{rows}
			{disabled}
			{required}
			{readonly}
			{maxlength}
			aria-label={label ? undefined : ariaLabel}
			aria-describedby={describedBy}
			aria-invalid={invalid || undefined}
			class={textareaClass}
		/>
	{/snippet}
</Field>
