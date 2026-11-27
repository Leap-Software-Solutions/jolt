export type Props = {
	value?: string;
	/** Number of numeric slots. Defaults to six. */
	length?: number;
	ariaLabel?: string;
	id?: string;
	describedBy?: string;
	invalid?: boolean;
	disabled?: boolean;
	onValueChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	class?: string;
	slotClass?: string;
};
