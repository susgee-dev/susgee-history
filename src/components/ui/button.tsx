import * as React from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';

const buttonVariants = {
	variant: {
		default: 'bg-primary-dark text-white shadow-xs hover:bg-primary-dark/90',
		twitch: 'bg-twitch text-white hover:bg-twitch-dark',
		destructive:
			'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
		outline:
			'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
		secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
		ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
		link: 'text-primary underline-offset-4 hover:underline'
	},
	size: {
		default: 'h-9 px-4 py-2 has-[>svg]:px-3 text-md',
		sm: 'rounded-md gap-1.5 px-3 py-1 has-[>svg]:px-2.5 text-sm',
		lg: 'rounded-md px-6 py-3 has-[>svg]:px-4 text-lg',
		icon: 'size-9'
	}
};

const baseButtonClasses =
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

type ButtonProps = {
	href?: string;
	className?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	as?: React.ElementType;
} & (
	| React.ComponentPropsWithoutRef<'button'>
	| (Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'href'> & { href: string })
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	href,
	as,
	...props
}: ButtonProps) {
	const buttonClass = cn(
		baseButtonClasses,
		buttonVariants.variant[variant],
		buttonVariants.size[size],
		className
	);

	if (href) {
		return (
			<Link
				className={buttonClass}
				href={href}
				{...(props as Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'href'>)}
			/>
		);
	}

	const Component = as || 'button';

	return <Component className={buttonClass} data-slot="button" {...(props as any)} />;
}

export { Button, buttonVariants };
