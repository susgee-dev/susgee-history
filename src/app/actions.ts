'use server';

import sevenTV from '@/lib/api/7tv';
import betterTTV from '@/lib/api/bttv';
import frankerFazeZ from '@/lib/api/ffz';
import helix from '@/lib/api/helix';
import recentMessages from '@/lib/api/recentMessages';
import parser from '@/lib/parser';
import provider from '@/lib/providers';
import { Cosmetics, ParsedMessage } from '@/types/message';

type LogsOptions = {
	channel?: string;
	url?: string;
	provider?: string;
	limit?: number;
	reverse?: boolean;
};

export async function fetchLogsData(options: LogsOptions): Promise<ParsedMessage[]> {
	const useChannel = !!options.channel;
	const useUrl = !useChannel && !!options.url;

	if (!useChannel && !useUrl) {
		throw new Error('Either channel or URL must be provided');
	}

	if (options.limit && options.limit <= 1) {
		delete options.limit;
	}

	let providerUrl = options.provider;
	const isDirectLogsUrl =
		useUrl || (providerUrl && providerUrl.startsWith('http') && !providerUrl.endsWith('/'));

	if (providerUrl && !isDirectLogsUrl) {
		const validatedUrl = provider.validateUrl(providerUrl);

		if (!validatedUrl) {
			delete options.provider;
		} else {
			options.provider = validatedUrl;
		}
	}

	let messages: string[] = [];
	let cosmetics: Cosmetics;

	if (useChannel) {
		const channel = options.channel!;

		if (!channel || channel.length > 25 || !/^[a-zA-Z0-9_]{3,25}$/.test(channel)) {
			throw new Error('Invalid channel name');
		}

		const channelId = await helix.getUserId(channel);

		if (!channelId) {
			throw new Error('Channel not found');
		}

		const [
			fetchedMessages,
			globalBadges,
			channelBadges,
			stvEmotes,
			bttvChannelEmotes,
			bttvGlobalEmotes,
			ffzChannelEmotes,
			ffzGlobalEmotes
		] = await Promise.all([
			recentMessages.get({
				channel: channel.toLowerCase(),
				provider: options.provider,
				limit: options.limit
			}),
			helix.getGlobalBadges(),
			helix.getChannelBadges(channelId),
			sevenTV.getEmotes(channelId),
			betterTTV.getChannelEmotes(channelId),
			betterTTV.getGlobalEmotes(),
			frankerFazeZ.getChannelEmotes(channelId),
			frankerFazeZ.getGlobalEmotes()
		]);

		messages = fetchedMessages;

		cosmetics = {
			twitch: {
				badges: new Map([
					...Array.from(globalBadges.entries()),
					...Array.from(channelBadges.entries())
				])
			},
			betterTtv: {
				emotes: new Map([...Array.from(bttvGlobalEmotes), ...Array.from(bttvChannelEmotes)])
			},
			frankerFazeZ: {
				emotes: new Map([...Array.from(ffzGlobalEmotes), ...Array.from(ffzChannelEmotes)])
			},
			sevenTv: {
				emotes: stvEmotes
			}
		};
	} else if (useUrl) {
		const [fetchedMessages, globalBadges] = await Promise.all([
			recentMessages.get({
				url: options.url,
				limit: options.limit
			}),
			helix.getGlobalBadges()
		]);

		messages = fetchedMessages;

		cosmetics = {
			twitch: {
				badges: globalBadges
			},
			betterTtv: {
				emotes: new Map()
			},
			frankerFazeZ: {
				emotes: new Map()
			},
			sevenTv: {
				emotes: new Map()
			}
		};
	}

	let processedMessages =
		messages
			?.map((msg: string) => parser.process(msg, cosmetics))
			?.filter((msg): msg is ParsedMessage => !!msg) || [];

	const shouldReverse =
		options.reverse === undefined ? provider.defaultReverseOrder : options.reverse;

	if (shouldReverse) {
		processedMessages = processedMessages.reverse();
	}

	return processedMessages;
}
