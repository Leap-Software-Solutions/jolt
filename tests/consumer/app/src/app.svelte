<script lang="ts">
	import {
		Accordion,
		AppShell,
		Badge,
		Button,
		Calendar,
		Card,
		CheckboxField,
		Combobox,
		CommandPalette,
		ConfirmDialog,
		ContextMenu,
		DataTable,
		DatePicker,
		EmptyState,
		HoverCard,
		Menubar,
		MultiSelect,
		NavigationMenu,
		PageHeader,
		Pagination,
		Progress,
		ScrollArea,
		SelectField,
		Sheet,
		Table,
		Sidebar,
		TextField,
		TextareaField,
		TimePicker,
		Toast,
		Toggle,
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

	const menubarMenus = [
		{
			value: 'file',
			label: 'File',
			items: [{ label: 'New file' }, { label: 'Open' }],
		},
		{
			value: 'edit',
			label: 'Edit',
			items: [{ label: 'Undo' }, { label: 'Redo' }],
		},
	];

	const sidebarGroups = [
		{
			label: 'Workspace',
			items: [
				{ label: 'Home', href: '#home' },
				{ label: 'Projects', href: '#projects', active: true },
				{ label: 'Engineers', href: '#engineers', badge: '2' },
			],
		},
	];

	const contextItems = [
		{ label: 'Edit' },
		{ label: 'Duplicate' },
		{ type: 'separator' as const },
		{ label: 'Delete', variant: 'destructive' as const },
	];

	let status = $state('active');
	let engineer = $state<Engineer | undefined>();
	let name = $state('');
	let brief = $state('');
	let accepted = $state(false);
	let selectedEngineers = $state<Engineer[]>([]);
	let toggled = $state(false);
	let page = $state(1);
	let commandsOpen = $state(false);
	let confirmOpen = $state(false);
	let sheetOpen = $state(false);
</script>

{#snippet navigationContent()}
	<a href="#outline" class="rounded-md p-2 text-sm hover:bg-accent">Outline</a>
	<a href="#typography" class="rounded-md p-2 text-sm hover:bg-accent">Typography</a>
{/snippet}

<AppShell>
	{#snippet sidebar()}
		<Sidebar groups={sidebarGroups} />
	{/snippet}

	<div class="grid max-w-md gap-4 p-8">
		<PageHeader title="Jolt consumer fixture" description="A packed-package smoke test.">
			{#snippet actions()}
				<Button>Create project</Button>
			{/snippet}
		</PageHeader>

		<div class="flex justify-center border-b pb-3">
			<NavigationMenu
				items={[
					{ value: 'foundations', label: 'Foundations', content: navigationContent },
					{ value: 'docs', label: 'Docs', href: '#docs', active: true },
				]}
			/>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<Button>Hello from Jolt</Button>
			<Badge variant="brand" label="New" />
			<Button variant="outline" onclick={() => toast.success('Saved')}>Toast</Button>
			<Toggle bind:pressed={toggled}>Bold</Toggle>
		</div>

		<Card title="Filters" description="Select and combobox wired to typed values.">
			<div class="grid gap-3">
				<SelectField label="Status" items={statuses} bind:value={status} />
				<MultiSelect
					items={engineers}
					bind:values={selectedEngineers}
					getKey={(item) => item.id}
					getLabel={(item) => item.name}
					ariaLabel="Engineers"
				/>
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
				<Calendar />
				<TimePicker label="Start time" />
				<HoverCard>
					{#snippet trigger(props)}
						<a {...props} href="#ada" class="text-sm underline">Ada Lovelace</a>
					{/snippet}
					<p class="text-sm text-muted-foreground">Engineer profile</p>
				</HoverCard>
				<Accordion items={help} />
				<Pagination count={100} perPage={10} bind:page />
			</div>
		</Card>

		<Card title="Advanced" description="Overlays, scroll areas, tables, and commands.">
			<div class="grid gap-3">
				<DataTable data={engineers} columns={tableColumns} caption="Engineers" />
				<Table data={engineers} columns={tableColumns} caption="Engineers" />
				<ContextMenu items={contextItems}>
					{#snippet trigger(props)}
						<div {...props} class="rounded-md border border-dashed p-3 text-sm">
							Right-click for row actions
						</div>
					{/snippet}
				</ContextMenu>
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
					<ConfirmDialog
						bind:open={confirmOpen}
						title="Delete project"
						description="This action cannot be undone."
						confirmLabel="Delete"
						variant="destructive"
						onConfirm={() => toast.success('Deleted')}
					>
						{#snippet trigger(props)}
							<Button {...props} variant="destructive">Delete project</Button>
						{/snippet}
					</ConfirmDialog>
					<Sheet bind:open={sheetOpen} title="Filters" description="Adjust the current view.">
						{#snippet trigger(props)}
							<Button {...props} variant="outline">Open sheet</Button>
						{/snippet}
						<p class="text-sm text-muted-foreground">Sheet content.</p>
					</Sheet>
				</div>
			</div>
		</Card>

		<Card>
			<EmptyState
				title="No engineers yet"
				description="Invite someone to the workspace to start assigning work."
			>
				{#snippet action()}
					<Button variant="outline">Invite engineer</Button>
				{/snippet}
			</EmptyState>
		</Card>
	</div>
</AppShell>

<Toast />
