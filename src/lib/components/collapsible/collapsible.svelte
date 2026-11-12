<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type CollapsibleTriggerProps = Record<string, unknown>;

	export type Props = {
		label?: string;
		trigger?: Snippet<[CollapsibleTriggerProps]>;
		children?: Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onOpenChangeComplete?: (open: boolean) => void;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import { Collapsible as BitsCollapsible } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		label = 'Details',
		trigger,
		children,
		open = $bindable(false),
		onOpenChange,
		onOpenChangeComplete,
		disabled,
		class: className,
		triggerClass,
		contentClass,
	}: Props = $props();
</script>

<BitsCollapsible.Root
	bind:open
	{onOpenChange}
	{onOpenChangeComplete}
	{disabled}
	data-slot="collapsible"
	class={cls('w-full', className)}
>
	{#if trigger}
		<BitsCollapsible.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsCollapsible.Trigger>
	{:else}
		<BitsCollapsible.Trigger
			data-slot="collapsible-trigger"
			class={cls(
				'group flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
				triggerClass,
			)}
		>
			{label}
			<ChevronDownIcon
				class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
			/>
		</BitsCollapsible.Trigger>
	{/if}

	<BitsCollapsible.Content
		data-slot="collapsible-content"
		class={cls(
			'overflow-hidden text-sm data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
			contentClass,
		)}
	>
		<div class="px-3 pt-2 pb-2 text-muted-foreground">
			{@render children?.()}
		</div>
	</BitsCollapsible.Content>
</BitsCollapsible.Root>
