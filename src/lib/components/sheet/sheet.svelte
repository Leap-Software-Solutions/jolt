<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type SheetSide = 'left' | 'right' | 'top' | 'bottom';
	export type SheetTriggerProps = Record<string, unknown>;

	export type Props = {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title: string;
		description?: string;
		trigger?: Snippet<[SheetTriggerProps]>;
		children?: Snippet;
		footer?: Snippet;
		side?: SheetSide;
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
		side = 'right',
		class: className,
	}: Props = $props();

	const sideClasses: Record<SheetSide, string> = {
		right:
			'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
		left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
		top: 'inset-x-0 top-0 max-h-[85vh] w-full border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
		bottom:
			'inset-x-0 bottom-0 max-h-[85vh] w-full border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
	};
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
			data-slot="sheet-overlay"
			class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsDialog.Content
			data-slot="sheet-content"
			class={cls(
				'fixed z-50 flex flex-col overflow-hidden border-border bg-background p-0 shadow-lg duration-200',
				sideClasses[side],
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
				className,
			)}
		>
			<div
				data-slot="sheet-header"
				class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4"
			>
				<div class="flex min-w-0 flex-col gap-2">
					<BitsDialog.Title class="text-lg font-semibold tracking-tight">
						{title}
					</BitsDialog.Title>
					{#if description}
						<BitsDialog.Description class="text-sm text-muted-foreground">
							{description}
						</BitsDialog.Description>
					{/if}
				</div>

				<BitsDialog.Close
					type="button"
					aria-label="Close"
					class="-me-1 -mt-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
				>
					<XIcon class="size-4" />
				</BitsDialog.Close>
			</div>

			<div
				data-slot="sheet-body"
				class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6"
			>
				{@render children?.()}
			</div>

			{#if footer}
				<div
					data-slot="sheet-footer"
					class="flex shrink-0 flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end"
				>
					{@render footer()}
				</div>
			{/if}
		</BitsDialog.Content>
	</BitsDialog.Portal>
</BitsDialog.Root>
