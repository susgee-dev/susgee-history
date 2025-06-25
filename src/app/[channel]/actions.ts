'use server';

import helix from '@/lib/api/helix';
import recentMessages from '@/lib/api/recentMessages';
import parser from '@/lib/parser';
import { ParsedMessage } from '@/types/message';

export async function fetchChannelData(channel: string) {
	if (!channel || channel.length > 25 || !/^[a-zA-Z0-9_]{3,25}$/.test(channel)) {
		throw new Error('Invalid channel name');
	}

	const channelId = await helix.getUserId(channel);

	if (!channelId) {
		throw new Error('Channel not found');
	}

	const [messages, globalBadges, channelBadges] = await Promise.all([
		recentMessages.get(channel),
		helix.getGlobalBadges(),
		helix.getChannelBadges(channelId)
	]);

	const parsed =
		messages
			?.map((msg: string) => parser.process(msg))
			?.filter((msg): msg is ParsedMessage => !!msg)
			.reverse() || [];

	return {
		messages: parsed,
		badges: {
			...globalBadges,
			...channelBadges
		}
	};
}
