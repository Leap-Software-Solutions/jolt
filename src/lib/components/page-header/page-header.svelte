<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		title: string;
		description?: string;
		breadcrumb?: Snippet;
		actions?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let { title, description, breadcrumb, actions, class: className }: Props = $props();
</script>

<header data-slot="page-header" class={cls('flex w-full flex-col gap-4', className)}>
	{#if breadcrumb}
		<div class="min-w-0">
			{@render breadcrumb()}
		</div>
	{/if}

	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="grid min-w-0 gap-1">
			<h1 class="text-2xl leading-tight font-semibold tracking-tight">
				{title}
			</h1>
			{#if description}
				<p class="max-w-2xl text-sm text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>

		{#if actions}
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
