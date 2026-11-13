<script lang="ts" module>
	import type { MenuEntry } from '../../types/menu.js';
	import type { ButtonVariant } from '../button/button.svelte';

	export type SplitButtonSize = 'sm' | 'default' | 'lg';
	export type SplitButtonVariant = Exclude<ButtonVariant, 'link'>;
	export type SplitButtonAlign = 'start' | 'center' | 'end';

	export type Props = {
		label: string;
		items: MenuEntry[];
		onAction?: () => void;
		variant?: SplitButtonVariant;
		size?: SplitButtonSize;
		disabled?: boolean;
		align?: SplitButtonAlign;
		menuLabel?: string;
		class?: string;
		mainClass?: string;
		menuClass?: string;
	};
</script>

<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { DropdownMenu } from '../dropdown-menu/index.js';

	let {
		label,
		items,
		onAction,
		variant = 'default',
		size = 'default',
		disabled,
		align = 'end',
		menuLabel = 'More options',
		class: className,
		mainClass,
		menuClass,
	}: Props = $props();

	const menuWidths: Record<SplitButtonSize, string> = {
		sm: 'w-8',
		default: 'w-9',
		lg: 'w-10',
	};

	function getDividerClass(value: SplitButtonVariant): string {
		if (value === 'ghost') return '';
		if (value === 'secondary') return 'border-l border-background';
		return 'border-l border-current/20';
	}
</script>

<div
	role="group"
	aria-label={label}
	data-slot="split-button"
	class={cls('isolate inline-flex', className)}
>
	<Button
		{variant}
		{size}
		{disabled}
		class={cls('rounded-r-none border-r-0', mainClass)}
		onclick={onAction}
	>
		{label}
	</Button>

	<DropdownMenu {items} {align}>
		{#snippet trigger(triggerProps)}
			<Button
				{...triggerProps}
				{variant}
				{size}
				{disabled}
				class={cls(menuWidths[size], 'rounded-l-none px-0', getDividerClass(variant), menuClass)}
				aria-label={menuLabel}
			>
				<ChevronDownIcon class="size-3.5" />
			</Button>
		{/snippet}
	</DropdownMenu>
</div>
