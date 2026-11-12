<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type AccordionItem = {
		value: string;
		title: string;
		content?: string;
		icon?: Component<{ class?: string }>;
		disabled?: boolean;
	};

	export type AccordionType = 'single' | 'multiple';
	export type AccordionOrientation = 'horizontal' | 'vertical';
	export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

	export type Props = {
		items: AccordionItem[];
		type?: AccordionType;
		value?: string | string[];
		onValueChange?: (value: string | string[]) => void;
		orientation?: AccordionOrientation;
		headingLevel?: AccordionHeadingLevel;
		loop?: boolean;
		disabled?: boolean;
		class?: string;
		itemClass?: string;
		triggerClass?: string;
		contentClass?: string;
		trigger?: Snippet<[AccordionItem]>;
		content?: Snippet<[AccordionItem]>;
	};
</script>

<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import { Accordion as BitsAccordion } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		items,
		type = 'single',
		value = $bindable(),
		onValueChange,
		orientation = 'vertical',
		headingLevel = 3,
		loop,
		disabled,
		class: className,
		itemClass,
		triggerClass,
		contentClass,
		trigger: triggerSnippet,
		content: contentSnippet,
	}: Props = $props();

	const singleValue = $derived(typeof value === 'string' ? value : '');
	const multipleValue = $derived(Array.isArray(value) ? value : []);

	function handleSingleValueChange(next: string): void {
		value = next;
		onValueChange?.(next);
	}

	function handleMultipleValueChange(next: string[]): void {
		value = next;
		onValueChange?.(next);
	}
</script>

{#snippet renderItem(item: AccordionItem)}
	<BitsAccordion.Item
		value={item.value}
		disabled={item.disabled}
		data-slot="accordion-item"
		class={cls('border-b last:border-b-0', itemClass)}
	>
		<BitsAccordion.Header level={headingLevel} class="flex">
			<BitsAccordion.Trigger
				data-slot="accordion-trigger"
				class={cls(
					'group flex flex-1 items-center justify-between gap-3 py-4 text-left text-sm font-medium transition-colors outline-none hover:text-brand-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
					triggerClass,
				)}
			>
				{#if triggerSnippet}
					{@render triggerSnippet(item)}
				{:else}
					<span class="flex min-w-0 items-center gap-2">
						{#if item.icon}
							{@const Icon = item.icon}
							<Icon class="size-4 shrink-0 text-muted-foreground" />
						{/if}
						<span>{item.title}</span>
					</span>
					<ChevronDownIcon
						class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
					/>
				{/if}
			</BitsAccordion.Trigger>
		</BitsAccordion.Header>

		<BitsAccordion.Content
			data-slot="accordion-content"
			class={cls(
				'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				contentClass,
			)}
		>
			<div class="pb-4 text-muted-foreground">
				{#if contentSnippet}
					{@render contentSnippet(item)}
				{:else}
					{item.content}
				{/if}
			</div>
		</BitsAccordion.Content>
	</BitsAccordion.Item>
{/snippet}

{#if type === 'multiple'}
	<BitsAccordion.Root
		type="multiple"
		value={multipleValue}
		onValueChange={handleMultipleValueChange}
		{orientation}
		{loop}
		{disabled}
		data-slot="accordion"
		class={cls('w-full', className)}
	>
		{#each items as item (item.value)}
			{@render renderItem(item)}
		{/each}
	</BitsAccordion.Root>
{:else}
	<BitsAccordion.Root
		type="single"
		value={singleValue}
		onValueChange={handleSingleValueChange}
		{orientation}
		{loop}
		{disabled}
		data-slot="accordion"
		class={cls('w-full', className)}
	>
		{#each items as item (item.value)}
			{@render renderItem(item)}
		{/each}
	</BitsAccordion.Root>
{/if}
