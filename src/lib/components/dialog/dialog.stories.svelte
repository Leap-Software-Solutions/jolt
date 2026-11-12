<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import Dialog, { type Props as DialogProps } from './dialog.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Dialog',
		component: Dialog,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let open = $state(false);
</script>

{#snippet template(args: Omit<DialogProps, 'open'>)}
	<Dialog bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props}>Open dialog</Button>
		{/snippet}

		<p class="text-sm text-muted-foreground">
			This is the dialog body. Replace it with a form, a confirmation, or any other content.
		</p>

		{#snippet footer()}
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={() => (open = false)}>Continue</Button>
		{/snippet}
	</Dialog>
{/snippet}

<Story
	name="Default"
	args={{ title: 'Delete asset', description: 'This action cannot be undone.' }}
	{template}
/>

<Story name="Without description" args={{ title: 'Rename asset' }} {template} />

{#snippet longTemplate(args: Omit<DialogProps, 'open'>)}
	<Dialog bind:open {...args}>
		{#snippet trigger(props)}
			<Button {...props}>Open long dialog</Button>
		{/snippet}

		<div class="grid gap-4 text-sm text-muted-foreground">
			<p>
				Jolt keeps behaviour and visual language together so product teams can focus on the work
				instead of rebuilding the same controls. This dialog is intentionally long enough to
				exercise scrolling.
			</p>
			<p>
				Every component starts with the same foundations: Manrope, a restrained palette, semantic
				tokens, and a small set of spacing and radius decisions. The result should feel familiar
				across applications.
			</p>
			<p>
				Behaviour comes from bits-ui. Jolt owns the composition, the accessible labels, and the
				visual states. When a primitive needs a workaround, the workaround stays inside the
				component rather than spreading across product code.
			</p>
			<p>
				The pattern-setting components use typed item arrays and named snippets. Select and Combobox
				are generic over their item types; DropdownMenu uses a discriminated union; Tabs and Card
				keep structural composition explicit.
			</p>
			<h4 class="text-sm font-medium text-foreground">Release checklist</h4>
			<ul class="list-disc ps-4">
				<li>Run the component and story test suites.</li>
				<li>Check the light and dark screenshots.</li>
				<li>Verify the packed consumer fixture.</li>
				<li>Review the changeset before tagging.</li>
			</ul>
			<p>
				Long dialogs should remain usable on short viewports. The content area scrolls within the
				viewport, while the title and description stay at the top of the scroll region.
			</p>
			<p>
				If a workflow needs more than a short confirmation, consider a dedicated page or a Sheet.
				Dialogs are best for focused decisions that should not lose the context behind them.
			</p>
		</div>

		{#snippet footer()}
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={() => (open = false)}>Continue</Button>
		{/snippet}
	</Dialog>
{/snippet}

<Story
	name="Long content"
	args={{ title: 'Review changes', description: 'Scroll through the details before continuing.' }}
	template={longTemplate}
/>
