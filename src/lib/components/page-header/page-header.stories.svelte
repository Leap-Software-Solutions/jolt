<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumb from '../breadcrumb/breadcrumb.svelte';
	import Button from '../button/button.svelte';
	import PageHeader, { type Props as PageHeaderProps } from './page-header.svelte';

	const breadcrumbItems = [
		{ label: 'Projects', href: '#' },
		{ label: 'Jolt', current: true },
	];

	const { Story } = defineMeta({
		title: 'Patterns/Page Header',
		component: PageHeader,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'Design system',
			description: 'Keep product teams aligned on the same components, tokens, and patterns.',
		},
	});
</script>

{#snippet template(args: Omit<PageHeaderProps, 'breadcrumb' | 'actions'>)}
	<div class="w-[42rem]">
		<PageHeader {...args}>
			{#snippet breadcrumb()}
				<Breadcrumb items={breadcrumbItems} />
			{/snippet}

			{#snippet actions()}
				<Button variant="outline">Edit</Button>
				<Button>New project</Button>
			{/snippet}
		</PageHeader>
	</div>
{/snippet}

<Story name="Default" {template} />
