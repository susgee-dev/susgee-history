'use client';

import { useEffect } from 'react';

import SearchChannel from '@/components/search-channel';
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
			title="Something went wrong"
			type="serverError"
		>
			<Button className="self-start" onClick={() => reset()}>
				Try again
			</Button>
			<SearchChannel />
		</Error>
	);
}
