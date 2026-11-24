<script lang="ts" module>
	import type { ButtonSize, ButtonVariant } from '../button/index.js';

	export type Props = {
		value: string;
		label?: string;
		copyLabel?: string;
		copiedLabel?: string;
		errorLabel?: string;
		unavailableLabel?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		timeout?: number;
		disabled?: boolean;
		class?: string;
		onCopy?: (value: string) => void;
		onError?: (error: unknown) => void;
	};
</script>

<script lang="ts">
	import { CheckIcon, CircleXIcon, ClipboardIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { copyText, isClipboardAvailable } from '../../utils/clipboard.js';
	import { Button } from '../button/index.js';

	type CopyStatus = 'idle' | 'copied' | 'error';

	let {
		value,
		label,
		copyLabel = 'Copy',
		copiedLabel = 'Copied',
		errorLabel = 'Copy failed',
		unavailableLabel = 'Clipboard unavailable',
		variant = 'ghost',
		size = label ? 'sm' : 'icon',
		timeout = 1800,
		disabled = false,
		class: className,
		onCopy,
		onError,
	}: Props = $props();

	let status = $state<CopyStatus>('idle');
	let isAvailable = $state(true);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;
	let previousValue: string | undefined;

	onMount(() => {
		isAvailable = isClipboardAvailable();
	});

	$effect(() => {
		if (previousValue === value) return;
		previousValue = value;
		resetStatus();
	});

	$effect(() => {
		return () => {
			if (resetTimer) clearTimeout(resetTimer);
		};
	});

	const isDisabled = $derived(disabled || !isAvailable);
	const stateLabel = $derived(getStateLabel());
	const announcement = $derived(getAnnouncement());

	function getStateLabel(): string {
		if (!isAvailable) return unavailableLabel;
		if (status === 'copied') return copiedLabel;
		if (status === 'error') return errorLabel;
		return label ?? copyLabel;
	}

	function getAnnouncement(): string {
		if (status === 'copied') return `${copiedLabel}.`;
		if (status === 'error') return `${errorLabel}.`;
		return '';
	}

	function resetStatus(): void {
		if (resetTimer) {
			clearTimeout(resetTimer);
			resetTimer = undefined;
		}
		status = 'idle';
	}

	async function handleCopy(): Promise<void> {
		resetStatus();

		try {
			await copyText(value);
			status = 'copied';
			onCopy?.(value);
			resetTimer = setTimeout(() => {
				status = 'idle';
				resetTimer = undefined;
			}, timeout);
		} catch (error: unknown) {
			status = 'error';
			onError?.(error);
		}
	}
</script>

<Button
	{variant}
	{size}
	disabled={isDisabled}
	data-slot="copy-button"
	class={className}
	title={stateLabel}
	aria-label={label ? undefined : stateLabel}
	onclick={handleCopy}
>
	{#if status === 'copied'}
		<CheckIcon class="text-brand-strong" />
	{:else if status === 'error'}
		<CircleXIcon class="text-destructive" />
	{:else}
		<ClipboardIcon />
	{/if}
	{#if label}
		<span>{stateLabel}</span>
	{/if}
</Button>
<span class="sr-only" role="status" aria-live="polite">{announcement}</span>
