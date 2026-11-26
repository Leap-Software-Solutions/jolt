import type { DateInput } from '../../utils/format.js';
import type { AttachmentItem } from '../attachment/types.js';

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';

export type ChatMessageStatus = 'sending' | 'streaming' | 'complete' | 'error';

export type ChatMessageData = {
	id: string;
	role: ChatRole;
	content: string;
	name?: string;
	avatarSrc?: string;
	initials?: string;
	timestamp?: DateInput;
	status?: ChatMessageStatus;
};

export type ChatSource = {
	label: string;
	href?: string;
	description?: string;
};

export type ChatAttachment = AttachmentItem;
