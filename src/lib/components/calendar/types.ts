import type { DateValue } from '@internationalized/date';

export type CalendarType = 'single' | 'multiple' | 'range';
export type CalendarWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CalendarRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};
export type CalendarValue = DateValue | DateValue[] | CalendarRange;

export type Props = {
	type?: CalendarType;
	value?: CalendarValue;
	onValueChange?: (value: CalendarValue | undefined) => void;
	minValue?: DateValue;
	maxValue?: DateValue;
	minDays?: number;
	maxDays?: number;
	disabled?: boolean;
	readonly?: boolean;
	numberOfMonths?: number;
	pagedNavigation?: boolean;
	fixedWeeks?: boolean;
	disableDaysOutsideMonth?: boolean;
	weekStartsOn?: CalendarWeekStartsOn;
	weekdayFormat?: Intl.DateTimeFormatOptions['weekday'];
	locale?: string;
	calendarLabel?: string;
	initialFocus?: boolean;
	showToday?: boolean;
	todayLabel?: string;
	class?: string;
};
