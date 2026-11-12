<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type FieldControlProps = {
		id: string;
		describedBy?: string;
		invalid: boolean;
	};

	export type Props = {
		id: string;
		label?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		class?: string;
		labelClass?: string;
		hintClass?: string;
		errorClass?: string;
		children: Snippet<[FieldControlProps]>;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		id,
		label,
		hint,
		error,
		required,
		class: className,
		labelClass,
		hintClass,
		errorClass,
		children,
	}: Props = $props();

	const hintId = $derived(`${id}-hint`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived.by(() => {
		if (error) return errorId;
		if (hint) return hintId;
		return undefined;
	});
	const invalid = $derived(Boolean(error));
</script>

<div data-slot="field" class={cls('grid gap-1.5', className)}>
	{#if label}
		<label for={id} class={cls('text-sm leading-none font-medium', labelClass)}>
			{label}
			{#if required}
				<span class="ms-0.5 text-destructive" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	{@render children({ id, describedBy, invalid })}

	{#if error}
		<p id={errorId} role="alert" class={cls('text-xs text-destructive', errorClass)}>
			{error}
		</p>
	{:else if hint}
		<p id={hintId} class={cls('text-xs text-muted-foreground', hintClass)}>
			{hint}
		</p>
	{/if}
</div>
