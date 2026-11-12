<script lang="ts" module>
	export type ToastTheme = 'light' | 'dark' | 'system';
	export type ToastPosition =
		'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

	export type Props = {
		position?: ToastPosition;
		theme?: ToastTheme;
		duration?: number;
		closeButton?: boolean;
		visibleToasts?: number;
		expand?: boolean;
		offset?: number | string;
		mobileOffset?: number | string;
		class?: string;
	};
</script>

<script lang="ts">
	import { Toaster, type ToasterProps } from 'svelte-sonner';
	import { cls } from '../../utils/index.js';

	let {
		position = 'bottom-right',
		theme = 'system',
		duration = 4000,
		closeButton = true,
		visibleToasts = 3,
		expand = false,
		offset = 24,
		mobileOffset = 16,
		class: className,
	}: Props = $props();

	const style = $derived(
		[
			'font-family: var(--font-sans)',
			'--normal-bg: var(--popover)',
			'--normal-border: var(--border)',
			'--normal-text: var(--popover-foreground)',
			'--border-radius: var(--radius-lg)',
			'--toast-close-button-start: unset',
			'--toast-close-button-end: 0',
			'--toast-close-button-transform: translate(35%, -35%)',
		].join('; '),
	);

	const toastOptions: ToasterProps['toastOptions'] = {
		classes: {
			description: 'text-muted-foreground!',
			closeButton: 'border-border! bg-popover! text-foreground!',
		},
	};
</script>

<Toaster
	{position}
	{theme}
	{duration}
	{closeButton}
	{visibleToasts}
	{expand}
	{offset}
	{mobileOffset}
	{style}
	{toastOptions}
	class={cls('font-sans', className)}
/>
