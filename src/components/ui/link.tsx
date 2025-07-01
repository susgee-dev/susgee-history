import type { ComponentPropsWithoutRef } from 'react';

import NextLink from 'next/link';

import { cn } from '@/lib/utils';

type LinkProps = ComponentPropsWithoutRef<'a'> & {
	href: string;
	className?: string;
};

export function Link({ href, className, ...props }: LinkProps) {
	return (
		<NextLink
			className={cn(
				className,
				'text-medium tap-highlight-transparent hover:opacity-hover active:opacity-disabled relative inline-flex items-center pl-1 text-primary no-underline outline-none transition-colors hover:text-primary-60'
			)}
			href={href}
			{...props}
		/>
	);
}
