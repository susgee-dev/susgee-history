import 'dotenv/config';

import BaseApi from './base';

import { ChannelResponse, GlobalEmotesResponse } from '@/types/api/betterTTV';
import { Emotes } from '@/types/emotes';

class BetterTTV extends BaseApi {
	constructor() {
		super('https://api.betterttv.net/3/cached/');
	}

	async getChannelEmotes(channelId: string): Promise<Emotes> {
		const response = await super.fetch<ChannelResponse>(`users/twitch/${channelId}`);

		const result: Emotes = new Map();

		for (const emote of response?.channelEmotes || []) {
			result.set(emote.code, {
				id: emote.id,
				name: emote.code,
				aspectRatio: 1,
				url: `https://cdn.betterttv.net/emote/${emote.id}/3x.webp`
			});
		}

		return result;
	}

	async getGlobalEmotes(): Promise<Emotes> {
		const response = await super.fetch<GlobalEmotesResponse>('emotes/global');

		const result: Emotes = new Map();

		for (const emote of response || []) {
			result.set(emote.code, {
				id: emote.id,
				name: emote.code,
				aspectRatio: 1,
				url: `https://cdn.betterttv.net/emote/${emote.id}/3x.webp`
			});
		}

		return result;
	}
}

const betterTTV = new BetterTTV();

export default betterTTV;
