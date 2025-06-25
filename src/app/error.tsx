'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import Error from '@/components/ui/error';
import logger from '@/lib/logger';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		logger.error(error);
	}, [error]);

	return (
		<Error
			message={error.message || "We're having trouble processing your request."}
			title="Something went wrong!"
			type="serverError"
		>
			<Button className="mt-4" onClick={() => reset()}>
				Try again
			</Button>
		</Error>
	);
}
