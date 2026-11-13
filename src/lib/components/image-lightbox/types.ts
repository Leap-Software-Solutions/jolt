import type { Snippet } from 'svelte';

export type LightboxTriggerProps = Record<string, unknown>;

export type LightboxImage = {
	src: string;
	alt: string;
	caption?: string;
};

export type Props = {
	images: LightboxImage[];
	open?: boolean;
	index?: number;
	ariaLabel?: string;
	trigger?: Snippet<[LightboxTriggerProps]>;
	onOpenChange?: (open: boolean) => void;
	onIndexChange?: (index: number) => void;
	class?: string;
};
