import { Metadata } from 'next';

import RootClient from '@/components/root-client';

export const metadata: Metadata = {
	title: 'Twitch history',
	description: "Read through a twitch channel's history"
};

export default function HomePage() {
	return <RootClient />;
}
