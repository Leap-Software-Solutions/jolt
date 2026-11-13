import type { Snippet } from 'svelte';

export type LightboxTriggerProps = Record<string, unknown>;

export type LightboxImage = {
	kind: 'image';
	src: string;
	alt: string;
	caption?: string;
	downloadUrl?: string;
};

export type LightboxTextFormat = 'markdown' | 'text';

export type LightboxText = {
	kind: 'text';
	title: string;
	content: string;
	format: LightboxTextFormat;
	downloadUrl?: string;
};

export type LightboxFile = {
	kind: 'file';
	name: string;
	mimeType?: string;
	downloadUrl?: string;
};

export type LightboxItem = LightboxImage | LightboxText | LightboxFile;

export type Props = {
	items: LightboxItem[];
	open?: boolean;
	index?: number;
	ariaLabel?: string;
	trigger?: Snippet<[LightboxTriggerProps]>;
	onOpenChange?: (open: boolean) => void;
	onIndexChange?: (index: number) => void;
	class?: string;
};
