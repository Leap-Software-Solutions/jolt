import type { DateValue } from '@internationalized/date';

export type CalendarType = 'single' | 'multiple';
export type CalendarWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Props = {
	type?: CalendarType;
	value?: DateValue | DateValue[];
	onValueChange?: (value: DateValue | DateValue[] | undefined) => void;
	minValue?: DateValue;
	maxValue?: DateValue;
	disabled?: boolean;
	readonly?: boolean;
	numberOfMonths?: number;
	pagedNavigation?: boolean;
	fixedWeeks?: boolean;
	weekStartsOn?: CalendarWeekStartsOn;
	weekdayFormat?: Intl.DateTimeFormatOptions['weekday'];
	locale?: string;
	calendarLabel?: string;
	initialFocus?: boolean;
	class?: string;
};
