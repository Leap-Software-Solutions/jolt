import type { Time } from '@internationalized/date';

export type TimePickerGranularity = 'hour' | 'minute' | 'second';

export type Props = {
	value?: Time;
	onValueChange?: (value: Time | undefined) => void;
	minValue?: Time;
	maxValue?: Time;
	label?: string;
	ariaLabel?: string;
	hint?: string;
	error?: string;
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	name?: string;
	locale?: string;
	hourCycle?: 12 | 24;
	granularity?: TimePickerGranularity;
	class?: string;
	inputClass?: string;
	labelClass?: string;
	segmentClass?: string;
};
