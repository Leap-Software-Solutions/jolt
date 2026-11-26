import type { DateInput } from '../../utils/format.js';

export type CommentThreadAuthor = {
	name: string;
	avatarSrc?: string;
	initials?: string;
};

export type CommentThreadComment = {
	id: string;
	author: CommentThreadAuthor;
	body: string;
	timestamp?: DateInput;
};

export type Props = {
	comments: CommentThreadComment[];
	resolved?: boolean;
	draft?: string;
	highlightedCommentId?: string;
	ariaLabel?: string;
	resolvedLabel?: string;
	openLabel?: string;
	resolveLabel?: string;
	reopenLabel?: string;
	quoteLabel?: string;
	replyLabel?: string;
	placeholder?: string;
	composerLabel?: string;
	onQuote?: (comment: CommentThreadComment) => void;
	onSubmit?: (draft: string) => void;
	onResolvedChange?: (resolved: boolean) => void;
	class?: string;
};
