<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ScrollArea, { type Props as ScrollAreaProps } from './scroll-area.svelte';

	const { Story } = defineMeta({
		title: 'Layout/ScrollArea',
		component: ScrollArea,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});

	type TemplateArgs = Omit<ScrollAreaProps, 'children'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="h-72 w-64 rounded-lg border bg-card">
		<ScrollArea {...args} class="h-full">
			<div class="grid gap-3 p-4 text-sm">
				{#each Array.from({ length: 20 }, (_, index) => index + 1) as item (item)}
					<div class="rounded-md border bg-background p-3">
						<p class="font-medium">Item {item}</p>
						<p class="text-muted-foreground">Scrollable content stays inside the panel.</p>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>
{/snippet}

{#snippet horizontalTemplate(args: TemplateArgs)}
	<div class="h-40 w-80 rounded-lg border bg-card">
		<ScrollArea {...args} class="h-full">
			<div class="flex gap-3 p-4 text-sm">
				{#each Array.from({ length: 12 }, (_, index) => index + 1) as item (item)}
					<div class="w-32 shrink-0 rounded-md border bg-background p-3">
						<p class="font-medium">Card {item}</p>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>
{/snippet}

{#snippet bothTemplate(args: TemplateArgs)}
	<div class="h-72 w-80 rounded-lg border bg-card">
		<ScrollArea {...args} class="h-full">
			<div class="grid w-[36rem] grid-cols-3 gap-3 p-4 text-sm">
				{#each Array.from({ length: 18 }, (_, index) => index + 1) as item (item)}
					<div class="rounded-md border bg-background p-3">
						<p class="font-medium">Panel {item}</p>
						<p class="text-muted-foreground">Content can scroll in both directions.</p>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Horizontal" args={{ orientation: 'horizontal' }} template={horizontalTemplate} />

<Story name="Both" args={{ orientation: 'both' }} template={bothTemplate} />

<Story name="Always visible" args={{ type: 'always' }} {template} />
