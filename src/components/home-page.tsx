'use client';

import SearchChannel from '@/components/search-channel';
import { Heading } from '@/components/ui/heading';

export default function HomePage() {
	return (
		<div className="flex flex-col gap-8 pt-16">
			<Heading as="h1" variant="compact">
				Twitch Channel History
			</Heading>
			<SearchChannel />
		</div>
	);
}
