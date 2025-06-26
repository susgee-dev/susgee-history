import { Metadata } from 'next';

import ClientPage from './client';

type PageParams = {
	params: Promise<{ channel: string }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { channel } = await params;

	if (!channel || channel.length > 25 || !/^[a-zA-Z0-9_]{3,25}$/.test(channel)) {
		return {
			title: 'Invalid Channel',
			description: 'Please enter a valid Twitch channel name'
		};
	}

	return {
		title: `${channel}'s Twitch Chat History`,
		description: `Recent chat messages from Twitch channel ${channel}`,
		openGraph: {
			title: `${channel} - Twitch Chat History`,
			description: `View recent chat messages from ${channel}'s Twitch channel`
		}
	};
}

export default async function ChannelPage({ params }: PageParams) {
	const { channel } = await params;

	return <ClientPage channel={channel} />;
}
