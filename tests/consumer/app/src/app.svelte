<script lang="ts">
	import { Badge, Button, Card, Combobox, Input, Select } from '@leap/jolt';

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

	let status = $state('active');
	let engineer = $state<Engineer | undefined>();
</script>

<main class="grid max-w-md gap-4 p-8">
	<div class="flex items-center gap-2">
		<Button>Hello from Jolt</Button>
		<Badge variant="brand" label="New" />
	</div>

	<Card title="Filters" description="Select and combobox wired to typed values.">
		<div class="grid gap-3">
			<Select items={statuses} bind:value={status} ariaLabel="Status" />
			<Combobox
				items={engineers}
				bind:value={engineer}
				getKey={(item) => item.id}
				getLabel={(item) => item.name}
				ariaLabel="Engineer"
			/>
			<Input aria-label="Search" placeholder="Search" />
		</div>
	</Card>
</main>
