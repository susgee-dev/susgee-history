import type { ComponentPropsWithoutRef } from 'react';

import NextLink from 'next/link';

import { cn } from '@/lib/utils';

type LinkProps = ComponentPropsWithoutRef<'a'> & {
	href: string;
	className?: string;
	unstyled?: boolean;
};

export function Link({ href, className, unstyled = false, ...props }: LinkProps) {
	return (
		<NextLink
			className={cn(
				className,
				!unstyled &&
					'text-medium tap-highlight-transparent hover:opacity-hover active:opacity-disabled relative inline-flex items-center pl-1 text-primary transition-opacity',
				'no-underline outline-none'
			)}
			href={href}
			{...props}
		/>
	);
}
