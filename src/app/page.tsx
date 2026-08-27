import { Metadata } from 'next';
import { Suspense } from 'react';

import RootClient from '@/components/root-client';

export const metadata: Metadata = {
	title: 'Twitch history',
	description: "Read through a twitch channel's history"
};

export default function HomePage() {
	return (
		<Suspense fallback={<div className="text-ink-muted py-16 text-center">Loading...</div>}>
			<RootClient />
		</Suspense>
	);
}
