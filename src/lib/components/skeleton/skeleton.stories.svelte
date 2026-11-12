<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Skeleton from './skeleton.svelte';

	const { Story } = defineMeta({
		title: 'Feedback/Skeleton',
		component: Skeleton,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-72 flex-col gap-3">
		<Skeleton class="h-5 w-2/3" />
		<Skeleton class="h-3 w-full" />
		<Skeleton class="h-3 w-5/6" />
	</div>
</Story>

<Story name="Avatar and text" asChild>
	<div class="flex items-center gap-3">
		<Skeleton class="size-10 rounded-full" />
		<div class="grid gap-2">
			<Skeleton class="h-4 w-32" />
			<Skeleton class="h-3 w-24" />
		</div>
	</div>
</Story>

<Story name="Card" asChild>
	<div class="w-80 rounded-xl border p-4">
		<div class="flex flex-col gap-3">
			<Skeleton class="h-5 w-32" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-5/6" />
			<Skeleton class="mt-2 h-9 w-24 rounded-md" />
		</div>
	</div>
</Story>

<Story name="List" asChild>
	<div class="grid w-72 gap-3">
		{#each [0, 1, 2, 3] as index (index)}
			<div class="flex items-center gap-3">
				<Skeleton class="size-8 rounded-full" />
				<div class="grid flex-1 gap-2">
					<Skeleton class="h-3.5 w-3/4" />
					<Skeleton class="h-3 w-1/2" />
				</div>
			</div>
		{/each}
	</div>
</Story>
