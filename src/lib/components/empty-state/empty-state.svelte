<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type Props = {
		title: string;
		description?: string;
		icon?: Component<{ class?: string }>;
		iconClass?: string;
		action?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let { title, description, icon, iconClass, action, class: className }: Props = $props();
</script>

<div
	data-slot="empty-state"
	class={cls(
		'flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center',
		className,
	)}
>
	{#if icon}
		{@const Icon = icon}
		<div
			class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
		>
			<Icon class={cls('size-6', iconClass)} />
		</div>
	{/if}

	<div class="grid max-w-sm gap-1">
		<h3 class="text-base font-medium">{title}</h3>
		{#if description}
			<p class="text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>

	{#if action}
		<div class="mt-1">{@render action()}</div>
	{/if}
</div>
