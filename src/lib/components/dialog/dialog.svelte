<script lang="ts" module>
	import type { DialogRootProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type DialogTriggerProps = Record<string, unknown>;

	export type Props = {
		open?: boolean;
		onOpenChange?: DialogRootProps['onOpenChange'];
		title: string;
		description?: string;
		trigger?: Snippet<[DialogTriggerProps]>;
		children?: Snippet;
		footer?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import { Dialog as BitsDialog } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		trigger,
		children,
		footer,
		class: className,
	}: Props = $props();
</script>

<BitsDialog.Root bind:open {onOpenChange}>
	{#if trigger}
		<BitsDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsDialog.Trigger>
	{/if}
	<BitsDialog.Portal>
		<BitsDialog.Overlay
			data-slot="dialog-overlay"
			class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsDialog.Content
			data-slot="dialog-content"
			class={cls(
				'fixed top-1/2 left-1/2 z-50 grid max-h-[85vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-lg duration-200',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className,
			)}
		>
			<div class="flex flex-col gap-2">
				<BitsDialog.Title class="text-lg font-semibold tracking-tight">
					{title}
				</BitsDialog.Title>
				{#if description}
					<BitsDialog.Description class="text-sm text-muted-foreground">
						{description}
					</BitsDialog.Description>
				{/if}
			</div>

			{@render children?.()}

			{#if footer}
				<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					{@render footer()}
				</div>
			{/if}

			<BitsDialog.Close
				type="button"
				aria-label="Close"
				class="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
			>
				<XIcon class="size-4" />
			</BitsDialog.Close>
		</BitsDialog.Content>
	</BitsDialog.Portal>
</BitsDialog.Root>
