export type StepperStepStatus = 'complete' | 'current' | 'pending' | 'error';

export type StepperStep = {
	id: string;
	label: string;
	description?: string;
	status: StepperStepStatus;
	href?: string;
};

export type StepperOrientation = 'horizontal' | 'vertical';

export type Props = {
	steps: StepperStep[];
	orientation?: StepperOrientation;
	ariaLabel?: string;
	onStepActivate?: (step: StepperStep) => void;
	class?: string;
};
