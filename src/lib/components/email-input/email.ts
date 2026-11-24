const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks an address with the same pragmatic rule used by the email invite field.
 *
 * The server remains responsible for deliverability and stricter domain checks.
 */
export function isEmail(value: string): boolean {
	return EMAIL_PATTERN.test(value);
}

/**
 * Normalises an email address for storage and duplicate detection.
 */
export function normalizeEmail(value: string): string {
	return value.trim().toLowerCase();
}
