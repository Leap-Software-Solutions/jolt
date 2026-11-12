<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import Sheet, { type Props as SheetProps } from './sheet.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Sheet',
		component: Sheet,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'Edit profile',
			description: 'Update the details shown to your team.',
		},
	});
</script>

<script lang="ts">
	let open = $state(false);
</script>

{#snippet template(args: Omit<SheetProps, 'trigger' | 'children' | 'footer' | 'open'>)}
	<Sheet bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props}>Open sheet</Button>
		{/snippet}
		<div class="grid gap-4">
			<p class="text-sm text-muted-foreground">
				Sheets are useful for focused editing without leaving the current page.
			</p>
			<div class="grid gap-1.5">
				<span class="text-sm font-medium">Name</span>
				<span class="rounded-md border bg-background px-3 py-2 text-sm">Ada Lovelace</span>
			</div>
			<div class="grid gap-1.5">
				<span class="text-sm font-medium">Role</span>
				<span class="rounded-md border bg-background px-3 py-2 text-sm">Engineering</span>
			</div>
		</div>
		{#snippet footer()}
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={() => (open = false)}>Save changes</Button>
		{/snippet}
	</Sheet>
{/snippet}

{#snippet longTemplate(args: Omit<SheetProps, 'trigger' | 'children' | 'footer' | 'open'>)}
	<Sheet bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props}>Open long sheet</Button>
		{/snippet}
		<div class="grid gap-4 text-sm text-muted-foreground">
			{#each Array.from({ length: 12 }, (_, index) => index + 1) as item (item)}
				<p>
					Section {item}. The header and footer stay in place while this content scrolls inside the
					sheet body.
				</p>
			{/each}
		</div>
		{#snippet footer()}
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={() => (open = false)}>Continue</Button>
		{/snippet}
	</Sheet>
{/snippet}

<Story name="Default" {template} />

<Story name="From the left" args={{ side: 'left' }} {template} />

<Story name="From the bottom" args={{ side: 'bottom' }} {template} />

<Story name="Long content" template={longTemplate} />
