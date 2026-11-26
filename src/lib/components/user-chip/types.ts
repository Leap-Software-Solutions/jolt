import type { AvatarSize, AvatarStatus } from '../avatar/index.js';

export type UserChipSize = AvatarSize;

export type Props = {
	name: string;
	avatarSrc?: string;
	initials?: string;
	status?: AvatarStatus;
	statusLabel?: string;
	meta?: string;
	size?: UserChipSize;
	onRemove?: () => void;
	removeLabel?: string;
	class?: string;
};
