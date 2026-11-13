<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FileUpload from './file-upload.svelte';

	const { Story } = defineMeta({
		title: 'Forms/File upload',
		component: FileUpload,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	const previewSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#131022"/><circle cx="200" cy="150" r="76" fill="#bba53d"/><rect x="144" y="94" width="112" height="112" rx="18" fill="#131022"/></svg>`;
	const previewFile = new File([previewSvg], 'brand-board.svg', { type: 'image/svg+xml' });
	let previewFiles = $state<File[]>([previewFile]);
</script>

<Story name="Default" asChild>
	<div class="w-[32rem] max-w-full">
		<FileUpload description="Drag and drop a document here, or click to browse." />
	</div>
</Story>

<Story name="Multiple" asChild>
	<div class="w-[32rem] max-w-full">
		<FileUpload multiple label="Upload assets" description="Images, documents, and archives." />
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="w-[32rem] max-w-full">
		<FileUpload disabled />
	</div>
</Story>

{#snippet previewTemplate()}
	<div class="w-[32rem] max-w-full">
		<FileUpload
			bind:files={previewFiles}
			multiple
			label="Upload assets"
			description="Images, documents, and archives."
		/>
	</div>
{/snippet}

<Story name="Image preview" template={previewTemplate} />
