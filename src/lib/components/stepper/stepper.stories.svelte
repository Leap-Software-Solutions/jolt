<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Stepper from './stepper.svelte';
	import type { Props as StepperProps, StepperStep } from './types.js';

	const steps: StepperStep[] = [
		{ id: 'build', label: 'Build', status: 'complete' },
		{ id: 'test', label: 'Test', status: 'current' },
		{ id: 'deploy', label: 'Deploy', status: 'pending' },
	];

	const descriptiveSteps: StepperStep[] = [
		{
			id: 'build',
			label: 'Build',
			description: 'Package compiled successfully.',
			status: 'complete',
		},
		{
			id: 'test',
			label: 'Test',
			description: 'Unit and browser checks are running.',
			status: 'current',
		},
		{
			id: 'deploy',
			label: 'Deploy',
			description: 'Waiting for the test stage.',
			status: 'pending',
		},
	];

	const linkedDescriptiveSteps: StepperStep[] = descriptiveSteps.map((step) => ({
		...step,
		href: `#${step.id}`,
	}));

	const linkedSteps: StepperStep[] = [
		{ id: 'build', label: 'Build', status: 'complete', href: '#build' },
		{ id: 'test', label: 'Test', status: 'current', href: '#test' },
		{ id: 'deploy', label: 'Deploy', status: 'pending', href: '#deploy' },
	];

	const errorSteps: StepperStep[] = [
		{ id: 'build', label: 'Build', status: 'complete' },
		{ id: 'test', label: 'Test', status: 'complete' },
		{ id: 'publish', label: 'Publish', status: 'error' },
		{ id: 'verify', label: 'Verify', status: 'pending' },
	];

	const { Story } = defineMeta({
		title: 'Data Display/Stepper',
		component: Stepper,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			steps,
			ariaLabel: 'Release progress',
		},
	});

	type TemplateArgs = StepperProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-[42rem] max-w-full">
		<Stepper {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With descriptions" args={{ steps: descriptiveSteps }} {template} />

<Story name="Vertical" args={{ steps: descriptiveSteps, orientation: 'vertical' }} {template} />

<Story name="Linked" args={{ steps: linkedSteps }} {template} />

<Story
	name="Linked vertical"
	args={{ steps: linkedDescriptiveSteps, orientation: 'vertical' }}
	{template}
/>

<Story name="Error" args={{ steps: errorSteps }} {template} />
