import { Metadata } from 'next';

import ClientPage from './client';

type ChannelPageParams = {
	params: { channel: string };
};

export async function generateMetadata({ params }: ChannelPageParams): Promise<Metadata> {
	const { channel } = params;

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
			description: `View recent chat messages from ${channel}'s Twitch stream`
		}
	};
}

export default function ChannelPage({ params }: ChannelPageParams) {
	return <ClientPage channel={params.channel} />;
}
