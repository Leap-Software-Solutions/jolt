export type DateInput = Date | string | number;

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const numberFormat = new Intl.NumberFormat('en');
const byteFormat = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

const TIME_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 365 * 24 * 60 * 60],
	['month', 30 * 24 * 60 * 60],
	['week', 7 * 24 * 60 * 60],
	['day', 24 * 60 * 60],
	['hour', 60 * 60],
	['minute', 60],
];

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

/**
 * Formats a date relative to now, for example `3 hours ago` or `in 2 days`.
 *
 * Values under 45 seconds render as `just now`. Invalid dates render as
 * `Invalid date` rather than throwing, so list rows stay renderable.
 */
export function formatRelativeTime(value: DateInput, now: Date = new Date()): string {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return 'Invalid date';

	const seconds = (date.getTime() - now.getTime()) / 1000;
	const absoluteSeconds = Math.abs(seconds);

	if (absoluteSeconds < 45) return 'just now';
	if (absoluteSeconds < 90) return relativeTimeFormat.format(Math.sign(seconds), 'minute');

	for (const [unit, unitSeconds] of TIME_UNITS) {
		if (absoluteSeconds >= unitSeconds) {
			return relativeTimeFormat.format(Math.round(seconds / unitSeconds), unit);
		}
	}

	return relativeTimeFormat.format(Math.round(seconds), 'second');
}

/**
 * Formats a duration in seconds using the two largest relevant units.
 *
 * Examples: `45s`, `2m 10s`, `1h 5m`, `3d 2h`.
 */
export function formatDuration(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds <= 0) return '0s';

	const total = Math.round(seconds);
	const days = Math.floor(total / 86_400);
	const hours = Math.floor((total % 86_400) / 3_600);
	const minutes = Math.floor((total % 3_600) / 60);
	const remainingSeconds = total % 60;

	if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
	if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	if (minutes > 0) return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	return `${remainingSeconds}s`;
}

/**
 * Formats a byte count using binary units, for example `1.5 KB` or `2 MB`.
 */
export function formatBytes(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

	let value = bytes;
	let unitIndex = 0;

	while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
		value /= 1024;
		unitIndex += 1;
	}

	if (unitIndex === 0) return `${formatNumber(Math.round(value))} B`;

	return `${byteFormat.format(value)} ${BYTE_UNITS[unitIndex]}`;
}

/**
 * Formats a number with the English grouping convention.
 *
 * Non-finite values render as an em dash, matching table fallbacks.
 */
export function formatNumber(value: number): string {
	if (!Number.isFinite(value)) return '—';
	return numberFormat.format(value);
}
