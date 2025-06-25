import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type HeadingProps = {
	children: ReactNode;
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	className?: string;
	variant?: 'default' | 'compact';
};

export function Heading({
	children,
	as = 'h2',
	className = '',
	variant = 'default'
}: HeadingProps) {
	const Tag = as;

	const styles = {
		h1: {
			default: 'text-4xl font-extrabold mt-6 mb-6',
			compact: 'text-4xl font-extrabold'
		},
		h2: {
			default: 'text-3xl font-bold mt-8 mb-5',
			compact: 'text-3xl font-bold'
		},
		h3: {
			default: 'text-2xl font-semibold mt-6 mb-4',
			compact: 'text-2xl font-semibold'
		},
		h4: {
			default: 'text-xl font-medium mt-4 mb-3',
			compact: 'text-xl font-medium'
		},
		h5: {
			default: 'text-lg font-medium mt-3 mb-2',
			compact: 'text-lg font-medium'
		},
		h6: {
			default: 'text-base font-medium mt-2 mb-1',
			compact: 'text-base font-medium'
		}
	};

	return <Tag className={cn(className, styles[as][variant])}>{children}</Tag>;
}
