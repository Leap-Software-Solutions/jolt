<script lang="ts" module>
	import { FileText, Folder, House, Layers } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumb, {
		type BreadcrumbItem,
		type Props as BreadcrumbProps,
	} from './breadcrumb.svelte';

	const items: BreadcrumbItem[] = [
		{ label: 'Home', href: '#', icon: House },
		{ label: 'Projects', href: '#', icon: Folder },
		{ label: 'Jolt', href: '#' },
		{ label: 'Components', current: true },
	];

	const longItems: BreadcrumbItem[] = [
		{ label: 'Home', href: '#', icon: House },
		{ label: 'Engineering', href: '#', icon: Folder },
		{ label: 'Design systems', href: '#', icon: Layers },
		{ label: 'Jolt', href: '#' },
		{ label: 'Documentation', href: '#', icon: FileText },
		{ label: 'Components', current: true },
	];

	const { Story } = defineMeta({
		title: 'Navigation/Breadcrumb',
		component: Breadcrumb,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items,
		},
	});

	type TemplateArgs = BreadcrumbProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-[36rem]">
		<Breadcrumb {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story
	name="Without icons"
	args={{
		items: [
			{ label: 'Home', href: '#' },
			{ label: 'Projects', href: '#' },
			{ label: 'Jolt', href: '#' },
			{ label: 'Components', current: true },
		],
	}}
	{template}
/>

<Story name="Long path" args={{ items: longItems, maxItems: 5 }} {template} />

<Story name="Long path expanded" args={{ items: longItems, maxItems: 10 }} {template} />
