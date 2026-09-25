'use client';

import { ReactNode } from 'react';

import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

type ErrorProps = {
	type?: ErrorType;
	title?: string;
	message?: string;
	headingAs?: 'h1' | 'h2';
	children?: ReactNode;
};

const errors = {
	badRequest: {
		code: 400,
		title: 'Bad request',
		message: 'Something went wrong with your request.'
	},
	notFound: {
		code: 404,
		title: 'Not found',
		message: "The page you're looking for doesn't exist (yet or anymore)."
	},
	serverError: {
		code: 500,
		title: 'Server error',
		message: 'Something went wrong on our end.'
	}
};

export type ErrorType = keyof typeof errors;

export default function Error({
	type = 'notFound',
	title,
	message,
	headingAs = 'h1',
	children
}: ErrorProps) {
	const error = errors[type];

	return (
		<div className={cn('flex flex-col gap-8', headingAs === 'h1' ? 'pt-10 sm:pt-20' : 'pt-6')}>
			<div className="flex flex-col gap-3">
				<span className="data w-fit rounded-chip border border-danger-border bg-danger-surface px-2 py-0.5 text-xs text-danger">
					Error {error.code}
				</span>
				<Heading as={headingAs} variant="compact">
					{title || error.title}
				</Heading>
				<p className="text-ink-muted">{message || error.message}</p>
			</div>
			{children && <div className="flex flex-col gap-4">{children}</div>}
		</div>
	);
}
