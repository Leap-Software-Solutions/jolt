<script lang="ts">
	import {
		Accordion,
		Badge,
		Button,
		Card,
		CheckboxField,
		Combobox,
		CommandPalette,
		DataTable,
		DatePicker,
		Pagination,
		Progress,
		ScrollArea,
		SelectField,
		Sheet,
		TextField,
		TextareaField,
		Toast,
		toast,
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

	const commandGroups = [
		{
			heading: 'Actions',
			items: [{ value: 'save', label: 'Save changes' }],
		},
	];

	const tableColumns = [
		{ id: 'name', header: 'Name', accessor: (row: Engineer) => row.name, sortable: true },
	];

	let status = $state('active');
	let engineer = $state<Engineer | undefined>();
	let name = $state('');
	let brief = $state('');
	let accepted = $state(false);
	let page = $state(1);
	let commandsOpen = $state(false);
	let sheetOpen = $state(false);
</script>

<main class="grid max-w-md gap-4 p-8">
	<div class="flex flex-wrap items-center gap-2">
		<Button>Hello from Jolt</Button>
		<Badge variant="brand" label="New" />
		<Button variant="outline" onclick={() => toast.success('Saved')}>Toast</Button>
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
			<DatePicker ariaLabel="Start date" />
			<Accordion items={help} />
			<Pagination count={100} perPage={10} bind:page />
		</div>
	</Card>

	<Card title="Advanced" description="Overlays, scroll areas, tables, and commands.">
		<div class="grid gap-3">
			<DataTable data={engineers} columns={tableColumns} caption="Engineers" />
			<ScrollArea class="h-32 rounded-md border">
				<div class="grid gap-2 p-3">
					{#each Array(8) as _, index}
						<p class="text-sm">Scrollable row {index + 1}</p>
					{/each}
				</div>
			</ScrollArea>
			<div class="flex flex-wrap gap-2">
				<CommandPalette groups={commandGroups} bind:open={commandsOpen}>
					{#snippet trigger(props)}
						<Button {...props} variant="outline">Commands</Button>
					{/snippet}
				</CommandPalette>
				<Sheet bind:open={sheetOpen} title="Filters" description="Adjust the current view.">
					{#snippet trigger(props)}
						<Button {...props} variant="outline">Open sheet</Button>
					{/snippet}
					<p class="text-sm text-muted-foreground">Sheet content.</p>
				</Sheet>
			</div>
		</div>
	</Card>
</main>

<Toast />
