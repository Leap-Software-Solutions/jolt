export class ClipboardUnavailableError extends Error {
	constructor() {
		super('Clipboard API is unavailable');
		this.name = 'ClipboardUnavailableError';
	}
}

/**
 * Reports whether the current browser exposes the async clipboard API.
 */
export function isClipboardAvailable(): boolean {
	return typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';
}

/**
 * Copies text to the clipboard using the async clipboard API.
 *
 * Throws when the API is unavailable or the browser rejects the write.
 */
export async function copyText(value: string): Promise<void> {
	if (!isClipboardAvailable()) throw new ClipboardUnavailableError();
	await navigator.clipboard.writeText(value);
}
