import {
	type BaseIssue,
	type BaseSchema,
	flatten,
	type InferInput,
	type InferOutput,
	safeParse,
} from 'valibot';

export type FormErrors<TValues> = Partial<Record<keyof TValues & string, string>> & {
	form?: string;
};

export type CreateFormOptions<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> = {
	schema: TSchema;
	initialValues: InferInput<TSchema>;
	onSubmit?: (values: InferOutput<TSchema>) => void | Promise<void>;
};

export type CreateFormResult<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> = {
	values: InferInput<TSchema>;
	errors: FormErrors<InferOutput<TSchema>>;
	isSubmitting: boolean;
	validate: () => boolean;
	handleSubmit: (event?: SubmitEvent) => Promise<void>;
	reset: () => void;
};

function issuesToErrors<TValues>(
	issues: readonly [BaseIssue<unknown>, ...BaseIssue<unknown>[]],
): FormErrors<TValues> {
	const flat = flatten(issues);
	const result: Record<string, string> = {};

	for (const [path, messages] of Object.entries(flat.nested ?? {})) {
		const field = path.split('.')[0];
		if (field && messages?.[0] && !result[field]) {
			result[field] = messages[0];
		}
	}

	if (flat.root?.[0]) {
		result.form = flat.root[0];
	}

	return result as FormErrors<TValues>;
}

/**
 * Creates a small valibot-backed form state object for non-SvelteKit surfaces.
 * SvelteKit applications should continue to use Superforms on the server and
 * map its errors with `toFieldErrors`.
 */
export function createForm<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
	options: CreateFormOptions<TSchema>,
): CreateFormResult<TSchema> {
	const initialValues = structuredClone(options.initialValues);
	let values = $state<InferInput<TSchema>>(structuredClone(options.initialValues));
	let errors = $state<FormErrors<InferOutput<TSchema>>>({});
	let isSubmitting = $state(false);

	function validate(): boolean {
		const result = safeParse(options.schema, values);

		if (result.success) {
			errors = {};
			return true;
		}

		errors = issuesToErrors(result.issues);
		return false;
	}

	async function handleSubmit(event?: SubmitEvent): Promise<void> {
		event?.preventDefault();

		if (!validate()) return;

		const parsed = safeParse(options.schema, values);

		if (!parsed.success) return;

		isSubmitting = true;

		try {
			await options.onSubmit?.(parsed.output);
		} finally {
			isSubmitting = false;
		}
	}

	function reset(): void {
		values = structuredClone(initialValues);
		errors = {};
	}

	return {
		get values() {
			return values;
		},
		get errors() {
			return errors;
		},
		get isSubmitting() {
			return isSubmitting;
		},
		validate,
		handleSubmit,
		reset,
	};
}
