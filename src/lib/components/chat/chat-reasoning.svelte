<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		label?: string;
		duration?: string;
		open?: boolean;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { BrainIcon, ChevronDownIcon } from '@lucide/svelte';
	import { Collapsible as BitsCollapsible } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		label = 'Reasoning',
		duration,
		open = $bindable(false),
		children,
		class: className,
	}: Props = $props();
</script>

<BitsCollapsible.Root
	bind:open
	data-slot="chat-reasoning"
	class={cls('w-full overflow-hidden rounded-lg border bg-muted/30', className)}
>
	<BitsCollapsible.Trigger
		class="group flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
	>
		<BrainIcon class="size-3.5 shrink-0" />
		<span class="font-medium">{label}</span>
		{#if duration}
			<span>· {duration}</span>
		{/if}
		<ChevronDownIcon
			class="ml-auto size-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
		/>
	</BitsCollapsible.Trigger>

	<BitsCollapsible.Content
		class="overflow-hidden border-t data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
	>
		<div class="p-3 text-sm leading-relaxed text-muted-foreground">
			{@render children?.()}
		</div>
	</BitsCollapsible.Content>
</BitsCollapsible.Root>
