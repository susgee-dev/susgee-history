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
					'relative inline-flex items-center pl-1 text-medium text-primary transition-opacity tap-highlight-transparent hover:opacity-hover active:opacity-disabled',
				'no-underline outline-none'
			)}
			href={href}
			{...props}
		/>
	);
}
