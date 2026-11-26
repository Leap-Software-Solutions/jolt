import { describe, expect, test } from 'vitest';
import { formatBytes, formatDuration, formatNumber, formatRelativeTime } from './format.js';

const now = new Date('2026-01-01T12:00:00.000Z');

function secondsBefore(seconds: number): Date {
	return new Date(now.getTime() - seconds * 1000);
}

function secondsAfter(seconds: number): Date {
	return new Date(now.getTime() + seconds * 1000);
}

describe('formatRelativeTime', () => {
	test('renders recent timestamps as just now', () => {
		expect(formatRelativeTime(secondsBefore(30), now)).toBe('just now');
		expect(formatRelativeTime(secondsAfter(30), now)).toBe('just now');
	});

	test('renders timestamps around the minute boundary', () => {
		expect(formatRelativeTime(secondsBefore(45), now)).toBe('1 minute ago');
		expect(formatRelativeTime(secondsBefore(60), now)).toBe('1 minute ago');
		expect(formatRelativeTime(secondsBefore(120), now)).toBe('2 minutes ago');
	});

	test('renders past timestamps with the largest sensible unit', () => {
		expect(formatRelativeTime(secondsBefore(2 * 60 * 60), now)).toBe('2 hours ago');
		expect(formatRelativeTime(secondsBefore(24 * 60 * 60), now)).toBe('yesterday');
		expect(formatRelativeTime(secondsBefore(3 * 24 * 60 * 60), now)).toBe('3 days ago');
		expect(formatRelativeTime(secondsBefore(60 * 24 * 60 * 60), now)).toBe('2 months ago');
	});

	test('renders future timestamps', () => {
		expect(formatRelativeTime(secondsAfter(2 * 60 * 60), now)).toBe('in 2 hours');
		expect(formatRelativeTime(secondsAfter(2 * 24 * 60 * 60), now)).toBe('in 2 days');
	});

	test('renders invalid dates without throwing', () => {
		expect(formatRelativeTime('not a date', now)).toBe('Invalid date');
	});
});

describe('formatDuration', () => {
	test('formats short durations in seconds', () => {
		expect(formatDuration(0)).toBe('0s');
		expect(formatDuration(45)).toBe('45s');
		expect(formatDuration(59.6)).toBe('1m');
	});

	test('formats minutes and hours', () => {
		expect(formatDuration(90)).toBe('1m 30s');
		expect(formatDuration(3_600)).toBe('1h');
		expect(formatDuration(3_660)).toBe('1h 1m');
	});

	test('formats days without exceeding two units', () => {
		expect(formatDuration(86_400)).toBe('1d');
		expect(formatDuration(90_061)).toBe('1d 1h');
	});

	test('clamps invalid and negative durations', () => {
		expect(formatDuration(-10)).toBe('0s');
		expect(formatDuration(Number.NaN)).toBe('0s');
	});
});

describe('formatBytes', () => {
	test('formats bytes and binary units', () => {
		expect(formatBytes(0)).toBe('0 B');
		expect(formatBytes(512)).toBe('512 B');
		expect(formatBytes(1_024)).toBe('1 KB');
		expect(formatBytes(1_536)).toBe('1.5 KB');
		expect(formatBytes(1_048_576)).toBe('1 MB');
	});

	test('clamps invalid byte counts', () => {
		expect(formatBytes(-1)).toBe('0 B');
		expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('0 B');
	});
});

describe('formatNumber', () => {
	test('groups numbers using English formatting', () => {
		expect(formatNumber(1_234)).toBe('1,234');
		expect(formatNumber(1_234.5)).toBe('1,234.5');
	});

	test('renders non-finite values as an em dash', () => {
		expect(formatNumber(Number.NaN)).toBe('—');
	});
});
