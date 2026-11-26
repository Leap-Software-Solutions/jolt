<script lang="ts">
	import Stepper from './stepper.svelte';
	import type { StepperOrientation, StepperStep } from './types.js';

	let {
		steps,
		orientation = 'horizontal',
		onStepActivate,
	}: {
		steps: StepperStep[];
		orientation?: StepperOrientation;
		onStepActivate?: (step: StepperStep) => void;
	} = $props();
</script>

<Stepper {steps} {orientation} {onStepActivate} ariaLabel="Release progress" />
