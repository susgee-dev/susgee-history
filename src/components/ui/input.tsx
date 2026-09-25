import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const controlClasses = cn(
	'w-full rounded-control border border-line bg-surface-raised px-4 py-2.5 text-base text-ink',
	'transition-colors placeholder:text-ink-faint',
	'focus:border-primary-60 focus:bg-accent focus:outline-none',
	'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas'
);

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
	({ className, ...props }, ref) => (
		<input ref={ref} className={cn(controlClasses, className)} {...props} />
	)
);

Input.displayName = 'Input';
