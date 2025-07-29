import 'dotenv/config';

import BaseApi from './base';

import { FfzChannelResponse, FfzGlobalResponse, FfzSet } from '@/types/api/frankerfazez';
import { Emotes } from '@/types/emotes';

class FrankerFazeZ extends BaseApi {
	constructor() {
		super('https://api.frankerfacez.com/v1/');
	}

	async getChannelEmotes(channelId: string): Promise<Emotes> {
		const response = await super.fetch<FfzChannelResponse>(`room/id/${channelId}`);

		return this.parseEmotesFromSets(response?.sets);
	}

	async getGlobalEmotes(): Promise<Emotes> {
		const response = await super.fetch<FfzGlobalResponse>('set/global');

		return this.parseEmotesFromSets(response?.sets);
	}

	private parseEmotesFromSets(sets: Record<string, FfzSet> | undefined): Emotes {
		const result: Emotes = new Map();

		Object.values(sets || {}).forEach((set) => {
			const emotes = set?.emoticons || [];

			emotes.forEach((emote) => {
				const aspectRatio = emote.width / emote.height || 1;

				result.set(emote.name, {
					id: emote.id.toString(),
					name: emote.name,
					aspectRatio,
					url: `https://cdn.frankerfacez.com/emote/${emote.id}/2`
				});
			});
		});

		return result;
	}
}

const frankerFazeZ = new FrankerFazeZ();

export default frankerFazeZ;
