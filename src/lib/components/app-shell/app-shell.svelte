<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		sidebar?: Snippet;
		header?: Snippet;
		children?: Snippet;
		class?: string;
		sidebarClass?: string;
		headerClass?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		sidebar,
		header,
		children,
		class: className,
		sidebarClass,
		headerClass,
		contentClass,
	}: Props = $props();
</script>

<div
	data-slot="app-shell"
	class={cls('flex h-svh w-full overflow-hidden bg-background', className)}
>
	{#if sidebar}
		<div data-slot="app-shell-sidebar" class={cls('shrink-0', sidebarClass)}>
			{@render sidebar()}
		</div>
	{/if}

	<div class="flex min-w-0 flex-1 flex-col">
		{#if header}
			<header
				data-slot="app-shell-header"
				class={cls('shrink-0 border-b bg-background', headerClass)}
			>
				{@render header()}
			</header>
		{/if}

		<main data-slot="app-shell-content" class={cls('min-h-0 flex-1 overflow-y-auto', contentClass)}>
			{@render children?.()}
		</main>
	</div>
</div>
