import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import NextLink from 'next/link';

import { cn } from '@/lib/utils';

type LinkProps = ComponentPropsWithoutRef<'a'> & {
	href: string;
	className?: string;
	unstyled?: boolean;
	iconBefore?: ReactNode;
	iconAfter?: ReactNode;
};

export function Link({
	href,
	className,
	iconAfter,
	iconBefore,
	unstyled = false,
	children,
	...props
}: LinkProps) {
	return (
		<NextLink
			className={cn(
				className,
				!unstyled && 'text-primary no-underline transition-colors hover:text-primary-60',
				'text-medium tap-highlight-transparent hover:opacity-hover active:opacity-disabled relative items-center outline-none',
				'inline-flex flex-row items-center gap-1'
			)}
			href={href}
			{...props}
		>
			{iconBefore}
			{children}
			{iconAfter}
		</NextLink>
	);
}
