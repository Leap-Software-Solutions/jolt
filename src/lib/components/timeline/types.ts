import type { Snippet } from 'svelte';
import type { DateInput } from '../../utils/format.js';

export type TimelineTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type TimelineActor = {
	name: string;
	avatarSrc?: string;
	initials?: string;
};

export type TimelineEvent = {
	id: string;
	title: string;
	description?: string;
	timestamp?: DateInput;
	actor?: TimelineActor;
	tone?: TimelineTone;
	/** Renders the event as a link. Takes precedence over `onActivate`. */
	href?: string;
	/** Renders the event as a button. */
	onActivate?: (event: TimelineEvent) => void;
};

export type TimelineGroup = {
	id: string;
	label?: string;
	events: TimelineEvent[];
};

export type Props = {
	groups: TimelineGroup[];
	ariaLabel?: string;
	/** Replaces the default actor avatar or tone marker. */
	marker?: Snippet<[TimelineEvent]>;
	class?: string;
};
