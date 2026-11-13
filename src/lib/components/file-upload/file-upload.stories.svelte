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
