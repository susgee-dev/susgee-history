'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

import { Heading } from '@/components/ui/heading';

interface ErrorProps {
	type?: ErrorType;
	title?: string;
	message?: string;
	children?: ReactNode;
}

const errors = {
	badRequest: {
		code: 400,
		title: 'Bad Request',
		message: 'something went wrong with your request.'
	},
	notFound: {
		code: 404,
		title: 'Not Found',
		message: "the page you're looking for doesn't exist (yet or anymore)."
	},
	serverError: {
		code: 500,
		title: 'Server Error',
		message: 'something went wrong on our end.'
	}
};

export type ErrorType = keyof typeof errors;

export default function Error({ type = 'notFound', title, message, children }: ErrorProps) {
	const error = errors[type];

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<Image
				unoptimized
				alt="Error"
				className="w-60 max-w-[80%]"
				height={240}
				src="/wat.gif"
				width={240}
			/>
			<Heading>
				<span className="text-red-500">{error.code}</span>
				<span> {title || error.title}</span>
			</Heading>
			<p className="text-center text-2xl">{message || error.message}</p>
			{children && <div className="mt-6">{children}</div>}
		</div>
	);
}
