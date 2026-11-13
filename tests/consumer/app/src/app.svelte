<script lang="ts">
	import {
		Accordion,
		AppShell,
		AttachmentList,
		AvatarGroup,
		Badge,
		Button,
		Calendar,
		Chat,
		ChatAttachments,
		ChatToolCall,
		Card,
		CheckboxField,
		CodeBlock,
		Combobox,
		CommandPalette,
		ConfirmDialog,
		ContextMenu,
		DataTable,
		DatePicker,
		EmptyState,
		FileUpload,
		HoverCard,
		Kbd,
		Loader,
		Menubar,
		MultiSelect,
		NavigationMenu,
		PageHeader,
		Pagination,
		Progress,
		ScrollArea,
		SelectField,
		Sheet,
		Spinner,
		SplitButton,
		Table,
		Sidebar,
		TextField,
		TextareaField,
		TimePicker,
		Toast,
		Toggle,
		TreeView,
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

	const attachmentItems = [
		{
			id: 'notes',
			name: 'notes.md',
			size: 1800,
			type: 'text/markdown',
			content: '# Notes\n\n- Review the attachment preview',
			href: 'https://example.com/notes.md',
		},
		{
			id: 'archive',
			name: 'assets.zip',
			size: 2400000,
			type: 'application/zip',
			href: 'https://example.com/assets.zip',
		},
	];

	const notesFile = new File(['# Notes\n\n- Review the responsive layout'], 'notes.md', {
		type: 'text/markdown',
	});

	const treeNodes = [
		{
			id: 'src',
			label: 'src',
			children: [
				{ id: 'components', label: 'components' },
				{ id: 'index', label: 'index.ts' },
			],
		},
		{ id: 'package', label: 'package.json' },
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
	let prompt = $state('');
	let chatMessages = $state([
		{ id: '1', role: 'user' as const, content: 'Summarise the Jolt release.' },
		{
			id: '2',
			role: 'assistant' as const,
			content: 'The release adds **calendar ranges** and a chat family.',
		},
	]);

	function sendChat(text: string): void {
		chatMessages = [
			...chatMessages,
			{ id: String(chatMessages.length + 1), role: 'user', content: text },
		];
		prompt = '';
	}
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
			<Spinner size="sm" />
			<Loader size="sm" />
			<SplitButton
				label="Save"
				items={[
					{ label: 'Save as draft', onSelect: () => {} },
					{ label: 'Save and publish', onSelect: () => {} },
				]}
				onAction={() => {}}
				menuLabel="More save options"
			/>
			<Kbd>⌘K</Kbd>
			<AvatarGroup
				items={engineers.map((person) => ({ alt: person.name, initials: person.name.slice(0, 2) }))}
				max={2}
			/>
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
				<FileUpload files={[notesFile]} description="Attach a brief for the request." />
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

		<Card title="Chat" description="Batteries-included conversation surface.">
			<div class="grid gap-3">
				<div class="h-[26rem]">
					<Chat messages={chatMessages} bind:value={prompt} onSend={sendChat} />
				</div>
				<ChatToolCall name="search_codebase" summary="Found the component exports">
					<CodeBlock language="json" code={'{\n  "results": 2\n}'} />
				</ChatToolCall>
				<ChatAttachments
					attachments={[
						{
							id: 'architecture',
							name: 'architecture.jpg',
							type: 'image/jpeg',
							href: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
							alt: 'A modern concrete building',
						},
						{
							id: 'notes',
							name: 'release-notes.md',
							type: 'text/markdown',
							content: '# Release notes\n\n- Generic attachment previews',
							href: 'https://example.com/release-notes.md',
						},
					]}
				/>
				<ChatToolCall
					name="delete_file"
					status="awaiting-approval"
					summary="Delete src/legacy.ts"
					approvalDescription="The assistant wants to delete a file. This cannot be undone."
					allowOptions={[{ label: 'Allow for this session', onSelect: () => {} }]}
					approvalMenu={[{ label: 'View arguments', onSelect: () => {} }]}
					onApprove={() => {}}
					onDeny={() => {}}
				>
					<p class="text-sm">The file will be removed from the workspace.</p>
				</ChatToolCall>
			</div>
		</Card>

		<Card title="Advanced" description="Overlays, scroll areas, tables, and commands.">
			<div class="grid gap-3">
				<AttachmentList attachments={attachmentItems} ariaLabel="Reference files" />
				<DataTable data={engineers} columns={tableColumns} caption="Engineers" />
				<Table data={engineers} columns={tableColumns} caption="Engineers" />
				<TreeView nodes={treeNodes} expandedIds={['src']} ariaLabel="Project files" />
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
