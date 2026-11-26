import type { Snippet } from 'svelte';

export type ApprovalBarStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalEffectTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type ApprovalEffect = {
	label: string;
	tone?: ApprovalEffectTone;
};

export type ApprovalActionContext = {
	locked: boolean;
	describedBy: string | undefined;
};

export type Props = {
	status?: ApprovalBarStatus;
	effect?: ApprovalEffect;
	title?: string;
	description?: string;
	children?: Snippet;
	actions?: Snippet<[ApprovalActionContext]>;
	locked?: boolean;
	lockReason?: string;
	approveLabel?: string;
	rejectLabel?: string;
	actionGroupLabel?: string;
	onApprove?: () => void;
	onReject?: () => void;
	class?: string;
};
