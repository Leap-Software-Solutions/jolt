<script lang="ts">
	import { CheckIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import type { Props, StepperStep, StepperStepStatus } from './types.js';

	let {
		steps,
		orientation = 'horizontal',
		ariaLabel = 'Steps',
		onStepActivate,
		class: className,
	}: Props = $props();

	const interactiveClass =
		'cursor-pointer rounded-md outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
	const verticalInteractiveClass = cls(interactiveClass, 'pointer-events-none');

	function getStatusLabel(status: StepperStepStatus): string {
		if (status === 'complete') return 'Complete';
		if (status === 'current') return 'Current';
		if (status === 'error') return 'Error';
		return 'Pending';
	}

	function getMarkerClass(status: StepperStepStatus): string {
		if (status === 'complete') return 'border-success bg-success text-success-foreground';
		if (status === 'current') return 'border-info bg-info text-info-foreground';
		if (status === 'error') return 'border-destructive bg-destructive text-destructive-foreground';
		return 'border-border bg-background text-muted-foreground';
	}

	function getLabelClass(status: StepperStepStatus): string {
		if (status === 'complete') return 'text-success';
		if (status === 'current') return 'text-info';
		if (status === 'error') return 'text-destructive';
		return 'text-muted-foreground';
	}

	function getConnectorClass(step: StepperStep | undefined): string {
		return step?.status === 'complete' ? 'bg-success' : 'bg-border';
	}
</script>

{#snippet marker(step: StepperStep)}
	<span
		data-slot="stepper-marker"
		data-status={step.status}
		class={cls(
			'relative z-20 flex size-6 shrink-0 items-center justify-center rounded-full border',
			getMarkerClass(step.status),
		)}
	>
		{#if step.status === 'complete'}
			<CheckIcon aria-hidden="true" class="size-3.5" />
		{:else if step.status === 'error'}
			<XIcon aria-hidden="true" class="size-3.5" />
		{:else if step.status === 'current'}
			<span class="size-1.5 rounded-full bg-current" aria-hidden="true"></span>
		{/if}
	</span>
{/snippet}

{#snippet stepCopy(step: StepperStep, centered: boolean)}
	<span class={cls('flex min-w-0 flex-col gap-0.5', centered && 'items-center text-center')}>
		<span class={cls('text-sm font-medium', getLabelClass(step.status))}>
			{step.label}
			<span class="sr-only">: {getStatusLabel(step.status)}</span>
		</span>
		{#if step.description}
			<span class="text-xs text-muted-foreground">{step.description}</span>
		{/if}
	</span>
{/snippet}

{#snippet horizontalBody(step: StepperStep)}
	<span class="relative z-10">{@render marker(step)}</span>
	<span class="mt-2 flex min-w-0 flex-col items-center">
		{@render stepCopy(step, true)}
	</span>
{/snippet}

{#snippet verticalBody(step: StepperStep, isInteractive: boolean)}
	<div class={cls('flex flex-col items-center', isInteractive && 'pointer-events-auto self-start')}>
		{@render marker(step)}
	</div>
	<div class={cls('min-w-0', isInteractive && 'pointer-events-auto')}>
		<div class="pt-0.5">
			{@render stepCopy(step, false)}
		</div>
	</div>
{/snippet}

{#snippet horizontalStep(step: StepperStep)}
	{#if step.href}
		<a
			href={step.href}
			class={cls('inline-flex max-w-full flex-col items-center px-2 py-1', interactiveClass)}
		>
			{@render horizontalBody(step)}
		</a>
	{:else if onStepActivate}
		<button
			type="button"
			class={cls('inline-flex max-w-full flex-col items-center px-2 py-1', interactiveClass)}
			onclick={() => onStepActivate?.(step)}
		>
			{@render horizontalBody(step)}
		</button>
	{:else}
		<div class="inline-flex max-w-full flex-col items-center px-2 py-1">
			{@render horizontalBody(step)}
		</div>
	{/if}
{/snippet}

{#snippet verticalStep(step: StepperStep)}
	{#if step.href}
		<a
			href={step.href}
			class={cls('inline-flex w-fit max-w-full gap-3 p-1', verticalInteractiveClass)}
		>
			{@render verticalBody(step, true)}
		</a>
	{:else if onStepActivate}
		<button
			type="button"
			class={cls('inline-flex w-fit max-w-full gap-3 p-1 text-left', verticalInteractiveClass)}
			onclick={() => onStepActivate?.(step)}
		>
			{@render verticalBody(step, true)}
		</button>
	{:else}
		<div class="inline-flex w-fit max-w-full gap-3 p-1">
			{@render verticalBody(step, false)}
		</div>
	{/if}
{/snippet}

<ol
	data-slot="stepper"
	data-orientation={orientation}
	aria-label={ariaLabel}
	class={cls(orientation === 'horizontal' ? 'flex w-full items-start' : 'flex flex-col', className)}
>
	{#each steps as step, index (step.id)}
		<li
			data-slot="stepper-step"
			data-status={step.status}
			aria-current={step.status === 'current' ? 'step' : undefined}
			class={cls(
				orientation === 'horizontal'
					? 'relative flex min-w-0 flex-1 flex-col items-center'
					: 'relative flex',
				orientation === 'vertical' && index < steps.length - 1 && 'pb-5',
			)}
		>
			{#if orientation === 'horizontal'}
				{#if index > 0}
					<span
						aria-hidden="true"
						data-slot="stepper-connector"
						class={cls('absolute top-4 left-0 h-px w-1/2', getConnectorClass(steps[index - 1]))}
					></span>
				{/if}
				{#if index < steps.length - 1}
					<span
						aria-hidden="true"
						data-slot="stepper-connector"
						class={cls('absolute top-4 right-0 h-px w-1/2', getConnectorClass(step))}
					></span>
				{/if}
				{@render horizontalStep(step)}
			{:else}
				{@render verticalStep(step)}
				{#if index < steps.length - 1}
					<span
						aria-hidden="true"
						data-slot="stepper-connector"
						class={cls(
							'pointer-events-none absolute top-6 -bottom-1.5 left-4 z-10 w-px',
							getConnectorClass(step),
						)}
					></span>
				{/if}
			{/if}
		</li>
	{/each}
</ol>
