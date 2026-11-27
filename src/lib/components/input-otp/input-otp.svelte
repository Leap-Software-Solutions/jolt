<script lang="ts">
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	let {
		value = $bindable(''),
		length = 6,
		ariaLabel = 'One-time code',
		id,
		describedBy,
		invalid = false,
		disabled = false,
		onValueChange,
		onComplete,
		class: className,
		slotClass,
	}: Props = $props();

	let inputElement = $state<HTMLInputElement | null>(null);
	let focused = $state(false);
	let selectionStart = $state(0);

	const slotCount = $derived(Math.max(1, Math.trunc(length)));
	const slots = $derived(Array.from({ length: slotCount }, (_, index) => value[index] ?? ''));
	const activeIndex = $derived(focused ? Math.min(selectionStart, slotCount - 1) : -1);

	function sanitize(raw: string): string {
		return raw.replace(/\D/g, '').slice(0, slotCount);
	}

	function syncSelection(): void {
		if (!inputElement) return;
		selectionStart = inputElement.selectionStart ?? 0;
	}

	function handleInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const next = sanitize(input.value);
		const caret = Math.min(input.selectionStart ?? next.length, next.length);

		if (input.value !== next) input.value = next;
		input.setSelectionRange(caret, caret);
		selectionStart = caret;

		if (next !== value) {
			value = next;
			onValueChange?.(next);

			if (next.length === slotCount) onComplete?.(next);
		}
	}

	function handleFocus(): void {
		focused = true;
		syncSelection();
	}

	function handleBlur(): void {
		focused = false;
	}

	function handleClick(event: MouseEvent): void {
		if (!inputElement) return;

		const slotElements =
			inputElement.parentElement?.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]') ??
			[];
		const clickedIndex = [...slotElements].findIndex((slot) => {
			const rect = slot.getBoundingClientRect();
			return event.clientX >= rect.left && event.clientX <= rect.right;
		});

		if (clickedIndex < 0) {
			syncSelection();
			return;
		}

		const nextIndex = Math.min(clickedIndex, value.length);
		inputElement.setSelectionRange(nextIndex, nextIndex);
		selectionStart = nextIndex;
	}

	function getSlotClass(character: string, index: number): string {
		const isActive = focused && index === activeIndex;
		const isFirst = index === 0;
		const isLast = index === slotCount - 1;

		return cls(
			'relative flex h-14 w-10 items-center justify-center border-y border-e border-input bg-background text-2xl font-medium transition-colors duration-150 ease-out motion-reduce:transition-none',
			"after:pointer-events-none after:absolute after:-inset-0.5 after:z-20 after:rounded-[inherit] after:border-2 after:opacity-0 after:transition-opacity after:duration-150 after:ease-out after:content-[''] motion-reduce:after:transition-none",
			character ? 'text-foreground' : 'text-muted-foreground',
			isFirst && 'rounded-s-lg border-s',
			isLast && 'rounded-e-lg',
			invalid && 'border-destructive',
			isActive && 'after:opacity-100',
			invalid ? 'after:border-destructive' : 'after:border-ring',
			slotClass,
		);
	}
</script>

<div
	data-slot="input-otp"
	data-invalid={invalid ? 'true' : undefined}
	data-disabled={disabled ? 'true' : undefined}
	class={cls(
		'relative isolate inline-flex rounded-lg',
		disabled && 'cursor-not-allowed opacity-50',
		className,
	)}
>
	{#each slots as character, index (index)}
		<span
			data-slot="input-otp-slot"
			data-active={focused && index === activeIndex ? 'true' : undefined}
			data-filled={character ? 'true' : undefined}
			aria-hidden="true"
			class={getSlotClass(character, index)}
		>
			{character}
			{#if focused && index === activeIndex && !character}
				<span
					aria-hidden="true"
					class="pointer-events-none absolute h-8 w-px animate-caret-blink-fast-in bg-foreground motion-reduce:animate-none"
				></span>
			{/if}
		</span>
	{/each}

	<input
		bind:this={inputElement}
		{id}
		{disabled}
		{value}
		maxlength={slotCount}
		type="text"
		inputmode="numeric"
		pattern="[0-9]*"
		autocomplete="one-time-code"
		spellcheck={false}
		autocapitalize="off"
		aria-label={ariaLabel}
		aria-describedby={describedBy}
		aria-invalid={invalid || undefined}
		data-slot="input-otp-input"
		class="absolute inset-0 z-10 size-full cursor-text rounded-md bg-transparent opacity-0 outline-hidden disabled:cursor-not-allowed"
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		onselect={syncSelection}
		onclick={handleClick}
		onkeyup={syncSelection}
	/>
</div>
