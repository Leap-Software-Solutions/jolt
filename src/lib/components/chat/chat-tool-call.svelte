<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { MenuEntry } from '../../types/menu.js';

	export type ChatToolStatus =
		'pending' | 'awaiting-approval' | 'running' | 'success' | 'denied' | 'error';

	export type ChatToolApprovalScope = 'once' | 'always';

	export type Props = {
		name: string;
		status?: ChatToolStatus;
		summary?: string;
		open?: boolean;
		children?: Snippet;
		approvalDescription?: string;
		allowLabel?: string;
		alwaysAllowLabel?: string;
		denyLabel?: string;
		approvalGroupLabel?: string;
		allowMenuLabel?: string;
		approvalMenuLabel?: string;
		allowOptions?: MenuEntry[];
		approvalMenu?: MenuEntry[];
		onApprove?: (scope: ChatToolApprovalScope) => void;
		onDeny?: () => void;
		class?: string;
	};
</script>

<script lang="ts">
	import {
		ChevronDownIcon,
		CircleCheckIcon,
		CircleIcon,
		CircleXIcon,
		EllipsisIcon,
		LoaderCircleIcon,
		ShieldQuestionMarkIcon,
		ShieldXIcon,
		WrenchIcon,
	} from '@lucide/svelte';
	import { Collapsible as BitsCollapsible } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { DropdownMenu } from '../dropdown-menu/index.js';
	import { SplitButton } from '../split-button/index.js';

	let {
		name,
		status = 'success',
		summary,
		open = $bindable(false),
		children,
		approvalDescription,
		allowLabel = 'Allow',
		alwaysAllowLabel = 'Always allow',
		denyLabel = 'Deny',
		approvalGroupLabel = 'Tool approval',
		allowMenuLabel = 'More allow options',
		approvalMenuLabel = 'More tool options',
		allowOptions,
		approvalMenu,
		onApprove,
		onDeny,
		class: className,
	}: Props = $props();

	const statusLabels: Record<ChatToolStatus, string> = {
		pending: 'Pending',
		'awaiting-approval': 'Awaiting approval',
		running: 'Running',
		denied: 'Denied',
		success: 'Complete',
		error: 'Failed',
	};

	const statusLabel = $derived(statusLabels[status]);
	const hasApprovalActions = $derived(
		Boolean(onApprove || onDeny || (approvalMenu?.length ?? 0) > 0),
	);

	const allowMenuItems = $derived<MenuEntry[]>([
		{ label: alwaysAllowLabel, onSelect: () => onApprove?.('always') },
		...(allowOptions ?? []),
	]);
</script>

<BitsCollapsible.Root
	bind:open
	data-slot="chat-tool-call"
	class={cls('w-full overflow-hidden rounded-lg border bg-card', className)}
>
	<BitsCollapsible.Trigger
		class="group flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
	>
		<WrenchIcon class="size-4 shrink-0 text-muted-foreground" />
		<span class="font-medium">{name}</span>
		{#if summary}
			<span class="min-w-0 truncate text-muted-foreground">{summary}</span>
		{/if}
		<span class="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
			{#if status === 'running'}
				<LoaderCircleIcon class="size-3.5 animate-spin" />
			{:else if status === 'success'}
				<CircleCheckIcon class="size-3.5" />
			{:else if status === 'denied'}
				<ShieldXIcon class="size-3.5" />
			{:else if status === 'error'}
				<CircleXIcon class="size-3.5" />
			{:else if status === 'awaiting-approval'}
				<ShieldQuestionMarkIcon class="size-3.5 text-brand-strong" />
			{:else}
				<CircleIcon class="size-3.5" />
			{/if}
			<span>{statusLabel}</span>
		</span>
		<ChevronDownIcon
			class="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
		/>
	</BitsCollapsible.Trigger>

	{#if status === 'awaiting-approval' && (approvalDescription || hasApprovalActions)}
		<div data-slot="chat-tool-approval" class="border-t bg-muted/40 px-3 py-3">
			<div class="grid gap-2.5">
				{#if approvalDescription}
					<p class="text-xs leading-relaxed text-muted-foreground">
						{approvalDescription}
					</p>
				{/if}

				{#if hasApprovalActions}
					<div
						role="group"
						aria-label={approvalGroupLabel}
						class="flex flex-wrap items-center justify-end gap-2"
					>
						{#if approvalMenu?.length}
							<DropdownMenu items={approvalMenu} align="end">
								{#snippet trigger(triggerProps)}
									<Button
										{...triggerProps}
										variant="ghost"
										size="icon"
										class="size-8"
										aria-label={approvalMenuLabel}
									>
										<EllipsisIcon />
									</Button>
								{/snippet}
							</DropdownMenu>
						{/if}

						{#if onDeny}
							<Button size="sm" variant="outline" onclick={onDeny}>
								{denyLabel}
							</Button>
						{/if}

						{#if onApprove}
							<SplitButton
								label={allowLabel}
								items={allowMenuItems}
								size="sm"
								menuLabel={allowMenuLabel}
								onAction={() => onApprove?.('once')}
							/>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<BitsCollapsible.Content
		class="overflow-hidden border-t data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
	>
		<div class="p-3 text-sm">
			{@render children?.()}
		</div>
	</BitsCollapsible.Content>
</BitsCollapsible.Root>
