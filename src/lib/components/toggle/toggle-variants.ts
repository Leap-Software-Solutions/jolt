import { tv, type VariantProps } from 'tailwind-variants';

export const toggleVariants = tv({
	base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default:
				'bg-transparent hover:bg-accent/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90',
			outline:
				'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90',
		},
		size: {
			sm: 'h-8 px-2.5 text-xs',
			default: 'h-9 px-3',
			lg: 'h-10 px-4',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type ToggleVariant = VariantProps<typeof toggleVariants>['variant'];
export type ToggleSize = VariantProps<typeof toggleVariants>['size'];
