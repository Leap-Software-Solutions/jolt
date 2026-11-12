<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		title?: string;
		description?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		class?: string;
		headerClass?: string;
		contentClass?: string;
		footerClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		title,
		description,
		header,
		footer,
		children,
		class: className,
		headerClass,
		contentClass,
		footerClass,
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || description));
</script>

<div
	data-slot="card"
	class={cls('rounded-xl border bg-card text-card-foreground shadow-sm', className)}
>
	{#if hasHeader}
		<div data-slot="card-header" class={cls('flex flex-col gap-1.5 p-6', headerClass)}>
			{#if header}
				{@render header()}
			{:else}
				{#if title}
					<h3 class="text-lg leading-none font-semibold tracking-tight">{title}</h3>
				{/if}
				{#if description}
					<p class="text-sm text-muted-foreground">{description}</p>
				{/if}
			{/if}
		</div>
	{/if}

	{#if children}
		<div data-slot="card-content" class={cls('p-6', hasHeader && 'pt-0', contentClass)}>
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<div data-slot="card-footer" class={cls('flex items-center p-6 pt-0', footerClass)}>
			{@render footer()}
		</div>
	{/if}
</div>
