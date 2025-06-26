'use server';

import sevenTV from '@/lib/api/7tv';
import helix from '@/lib/api/helix';
import recentMessages from '@/lib/api/recentMessages';
import { processWithEmotes } from '@/lib/parser';
import { ParsedMessage } from '@/types/message';

export async function fetchChannelData(channel: string) {
	if (!channel || channel.length > 25 || !/^[a-zA-Z0-9_]{3,25}$/.test(channel)) {
		throw new Error('Invalid channel name');
	}

	const channelId = await helix.getUserId(channel);

	if (!channelId) {
		throw new Error('Channel not found');
	}

	const [messages, globalBadges, channelBadges, emoteSet] = await Promise.all([
		recentMessages.get(channel),
		helix.getGlobalBadges(),
		helix.getChannelBadges(channelId),
		sevenTV.getUserEmoteSet(channelId)
	]);

	const emotes = emoteSet?.emote_set?.items || [];

	const parsed =
		messages
			?.map((msg: string) => processWithEmotes(msg, emotes))
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
