import { Metadata } from 'next';

import ChatMessage from '@/components/chat-message';
import Error from '@/components/ui/error';
import { Heading } from '@/components/ui/heading';
import helix from '@/lib/api/helix';
import recentMessages from '@/lib/api/recentMessages';
import logger from '@/lib/logger';
import parser from '@/lib/parser';
import { ParsedMessage } from '@/types/message';

type ChannelPageParams = {
	params: Promise<{ channel: string }>;
};

type ChannelPageProps = {
	params: Promise<{ channel: string }>;
};

export async function generateMetadata({ params }: ChannelPageParams): Promise<Metadata> {
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
			description: `View recent chat messages from ${channel}'s Twitch stream`
		}
	};
}

export default async function ChannelPage({ params }: ChannelPageProps) {
	const { channel } = await params;

	if (!channel || channel.length > 25 || !/^[a-zA-Z0-9_]{3,25}$/.test(channel)) {
		return;
	}

	let parsed: ParsedMessage[];
	let badges: Record<string, string>;

	try {
		const channelId = await helix.getUserId(channel);

		if (!channelId) {
			return (
				<Error
					message="The channel you're looking for doesn't exist"
					title="Channel not found"
					type="notFound"
				/>
			);
		}

		const [messages, globalBadges, channelBadges] = await Promise.all([
			recentMessages.get(channel),
			helix.getGlobalBadges(),
			helix.getChannelBadges(channelId)
		]);

		parsed = messages
			?.map((msg: string) => parser.process(msg))
			?.filter(Boolean)
			.reverse();

		badges = {
			...globalBadges,
			...channelBadges
		};
	} catch (error) {
		logger.error('Failed to fetch messages:', error);

		return;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Heading as="h1" className="mb-6 flex flex-col border-b border-primary/30 pb-6">
				<span>recent messages:</span>
				<span className="gradient-text">{channel}</span>
			</Heading>

			<div className="space-y-1 leading-snug text-white">
				{parsed.map((msg) => (
					<ChatMessage key={msg!.id} badges={badges} message={msg!} />
				))}
			</div>
		</div>
	);
}
