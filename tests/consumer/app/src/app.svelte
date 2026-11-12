<script lang="ts">
	import {
		Accordion,
		Badge,
		Button,
		Card,
		CheckboxField,
		Combobox,
		Pagination,
		Progress,
		SelectField,
		TextField,
		TextareaField,
	} from '@leap/jolt';

	type Engineer = {
		id: string;
		name: string;
	};

	const statuses = [
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
	];

	const engineers: Engineer[] = [
		{ id: 'ada', name: 'Ada Lovelace' },
		{ id: 'grace', name: 'Grace Hopper' },
	];

	const help = [
		{
			value: 'shipping',
			title: 'How long does shipping take?',
			content: 'Orders arrive in three to five days.',
		},
	];

	let status = $state('active');
	let engineer = $state<Engineer | undefined>();
	let name = $state('');
	let brief = $state('');
	let accepted = $state(false);
	let page = $state(1);
</script>

<main class="grid max-w-md gap-4 p-8">
	<div class="flex items-center gap-2">
		<Button>Hello from Jolt</Button>
		<Badge variant="brand" label="New" />
	</div>

	<Card title="Filters" description="Select and combobox wired to typed values.">
		<div class="grid gap-3">
			<SelectField label="Status" items={statuses} bind:value={status} />
			<Combobox
				items={engineers}
				bind:value={engineer}
				getKey={(item) => item.id}
				getLabel={(item) => item.name}
				ariaLabel="Engineer"
			/>
			<TextField label="Search" placeholder="Search" bind:value={name} />
			<TextareaField label="Brief" placeholder="Project brief" bind:value={brief} />
			<CheckboxField label="Accept the terms" bind:checked={accepted} />
			<Progress value={40} label="Uploading assets" showValue />
			<Accordion items={help} />
			<Pagination count={100} perPage={10} bind:page />
		</div>
	</Card>
</main>
