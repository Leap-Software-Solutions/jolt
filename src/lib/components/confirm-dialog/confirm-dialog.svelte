<script lang="ts" module>
	import type { AlertDialogRootProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ConfirmDialogTriggerProps = Record<string, unknown>;
	export type ConfirmDialogVariant = 'default' | 'destructive';

	export type Props = {
		open?: boolean;
		onOpenChange?: AlertDialogRootProps['onOpenChange'];
		title: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: ConfirmDialogVariant;
		onConfirm?: () => void;
		trigger?: Snippet<[ConfirmDialogTriggerProps]>;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { AlertDialog as BitsAlertDialog } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { buttonVariants } from '../button/index.js';

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		variant = 'default',
		onConfirm,
		trigger,
		children,
		class: className,
	}: Props = $props();

	function handleConfirm(): void {
		onConfirm?.();
		open = false;
	}
</script>

<BitsAlertDialog.Root bind:open {onOpenChange}>
	{#if trigger}
		<BitsAlertDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsAlertDialog.Trigger>
	{/if}

	<BitsAlertDialog.Portal>
		<BitsAlertDialog.Overlay
			data-slot="confirm-dialog-overlay"
			class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsAlertDialog.Content
			data-slot="confirm-dialog-content"
			class={cls(
				'fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background p-0 shadow-lg duration-200',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className,
			)}
		>
			<div data-slot="confirm-dialog-header" class="flex flex-col gap-2 px-6 pt-6 pb-4">
				<BitsAlertDialog.Title class="text-lg font-semibold tracking-tight">
					{title}
				</BitsAlertDialog.Title>
				{#if description}
					<BitsAlertDialog.Description class="text-sm text-muted-foreground">
						{description}
					</BitsAlertDialog.Description>
				{/if}
			</div>

			{#if children}
				<div
					data-slot="confirm-dialog-body"
					class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6"
				>
					{@render children()}
				</div>
			{/if}

			<div
				data-slot="confirm-dialog-footer"
				class="flex shrink-0 flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end"
			>
				<BitsAlertDialog.Cancel type="button" class={buttonVariants({ variant: 'outline' })}>
					{cancelLabel}
				</BitsAlertDialog.Cancel>
				<BitsAlertDialog.Action
					type="button"
					class={buttonVariants({ variant })}
					onclick={handleConfirm}
				>
					{confirmLabel}
				</BitsAlertDialog.Action>
			</div>
		</BitsAlertDialog.Content>
	</BitsAlertDialog.Portal>
</BitsAlertDialog.Root>
