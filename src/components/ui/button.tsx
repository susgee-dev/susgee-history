import * as React from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';

const buttonVariants = {
	variant: {
		default: 'bg-primary-dark hover:bg-primary text-white',
		gradient:
			'bg-gradient-text text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] hover:brightness-110',
		twitch: 'bg-twitch hover:bg-twitch-dark text-white',
		secondary: 'bg-surface-raised border-line text-ink hover:bg-accent border',
		outline: 'border-line-strong text-ink hover:bg-accent hover:text-ink-bright border',
		ghost: 'text-ink hover:bg-accent hover:text-ink-bright',
		danger:
			'border-danger-border bg-danger-surface text-danger hover:bg-danger border hover:text-white',
		destructive: 'bg-destructive text-destructive-foreground hover:brightness-110',
		link: 'text-primary underline-offset-4 hover:underline'
	},
	size: {
		default: 'h-9 px-4 py-2 has-[>svg]:px-3',
		sm: 'gap-1.5 px-3 py-1 has-[>svg]:px-2.5 text-sm',
		lg: 'h-12 px-6 py-3 has-[>svg]:px-4 text-lg',
		icon: 'size-9'
	}
};

const baseButtonClasses =
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas aria-invalid:border-destructive';

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
