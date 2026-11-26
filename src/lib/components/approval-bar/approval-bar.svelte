<script lang="ts">
	import { CheckIcon, LockKeyholeIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Badge, type BadgeVariant } from '../badge/index.js';
	import { Button } from '../button/index.js';
	import type { ApprovalEffectTone, Props } from './types.js';

	let {
		status = 'pending',
		effect,
		title,
		description,
		children,
		actions,
		locked = false,
		lockReason,
		approveLabel = 'Approve',
		rejectLabel = 'Reject',
		actionGroupLabel = 'Approval actions',
		onApprove,
		onReject,
		class: className,
	}: Props = $props();

	const lockReasonId = $props.id();

	const effectVariants: Record<ApprovalEffectTone, BadgeVariant> = {
		neutral: 'neutral',
		info: 'info',
		success: 'success',
		warning: 'warning',
		danger: 'danger',
	};

	const isLocked = $derived(locked && status === 'pending');
	const isResolved = $derived(status !== 'pending');
	const hasActions = $derived(Boolean(onApprove || onReject || actions));
	const showActions = $derived(status === 'pending' && hasActions);
	const lockMessage = $derived(lockReason?.trim() || 'This action is locked.');
	const effectVariant = $derived(effectVariants[effect?.tone ?? 'neutral']);
</script>

<div
	data-slot="approval-bar"
	data-status={status}
	data-locked={isLocked ? 'true' : undefined}
	class={cls('overflow-hidden rounded-lg border bg-card', className)}
>
	<div class="space-y-2 p-3">
		{#if effect || isLocked || isResolved}
			<div class="flex flex-wrap items-center gap-2">
				{#if effect}
					<span data-slot="approval-bar-effect">
						<Badge label={effect.label} variant={effectVariant} />
					</span>
				{/if}
				{#if isLocked}
					<span data-slot="approval-bar-status" role="status" aria-live="polite">
						<Badge label="Locked" variant="neutral" icon={LockKeyholeIcon} />
					</span>
				{:else if status === 'approved'}
					<span data-slot="approval-bar-status" role="status" aria-live="polite">
						<Badge label="Approved" variant="success" icon={CheckIcon} />
					</span>
				{:else if status === 'rejected'}
					<span data-slot="approval-bar-status" role="status" aria-live="polite">
						<Badge label="Rejected" variant="danger" icon={XIcon} />
					</span>
				{/if}
			</div>
		{/if}

		{#if title}
			<p class="text-sm font-medium">{title}</p>
		{/if}
		{#if description}
			<p class="text-xs leading-relaxed text-muted-foreground">{description}</p>
		{/if}
		{@render children?.()}

		{#if isLocked}
			<p
				id={lockReasonId}
				data-slot="approval-bar-lock"
				class="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"
			>
				<LockKeyholeIcon aria-hidden="true" class="mt-0.5 size-3.5 shrink-0" />
				<span>{lockMessage}</span>
			</p>
		{/if}
	</div>

	{#if showActions}
		<div
			role="group"
			aria-label={actionGroupLabel}
			data-slot="approval-bar-actions"
			class="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/40 px-3 py-3"
		>
			{@render actions?.({ locked: isLocked, describedBy: isLocked ? lockReasonId : undefined })}
			{#if onReject}
				<Button
					variant="outline"
					size="sm"
					disabled={isLocked}
					aria-describedby={isLocked ? lockReasonId : undefined}
					onclick={onReject}
				>
					{rejectLabel}
				</Button>
			{/if}
			{#if onApprove}
				<Button
					size="sm"
					disabled={isLocked}
					aria-describedby={isLocked ? lockReasonId : undefined}
					onclick={onApprove}
				>
					{approveLabel}
				</Button>
			{/if}
		</div>
	{/if}
</div>
