export type SuperformErrors = Record<string, string | string[] | undefined>;

/**
 * Collapses Superforms' string-or-array field errors into the single string
 * shape used by the Jolt field wrappers.
 */
export function toFieldErrors(errors: SuperformErrors): Record<string, string> {
	const result: Record<string, string> = {};

	for (const [field, value] of Object.entries(errors)) {
		const message = Array.isArray(value) ? value[0] : value;
		if (message) result[field] = message;
	}

	return result;
}
