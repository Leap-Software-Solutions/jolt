export type TagsInputInvalidReason = 'invalid' | 'duplicate' | 'limit';

export type Props = {
	value?: string[];
	onValueChange?: (value: string[]) => void;
	placeholder?: string;
	ariaLabel?: string;
	id?: string;
	describedBy?: string;
	invalid?: boolean;
	disabled?: boolean;
	maxTags?: number;
	validate?: (value: string) => boolean;
	normalize?: (value: string) => string;
	separators?: string[];
	commitOnBlur?: boolean;
	allowDuplicates?: boolean;
	onInvalid?: (value: string, reason: TagsInputInvalidReason) => void;
	class?: string;
	inputClass?: string;
	chipClass?: string;
};
