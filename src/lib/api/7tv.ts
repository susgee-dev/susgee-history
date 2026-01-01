import BaseApi from './base';

import { SevenTVResponse } from '@/types/api/7tv';
import { Emotes } from '@/types/emotes';

class SevenTV extends BaseApi {
	constructor() {
		super('https://7tv.io/v4/gql');
	}

	async getEmotes(twitchId: string): Promise<Emotes> {
		const query = `{
			emoteSets {
				global {
					emotes {
						items {
							id
							alias
							emote {
								aspectRatio
							}
						}
					}
			}		
		}
		users {
			userByConnection(platform: TWITCH, platformId: "${twitchId}") {
				style {
					activeEmoteSet {
							emotes {
								items {
									id
									alias
									emote {
										aspectRatio
									}		
								}
							}
						}
					}
				}
			}
    }`;

		const response = await super.fetch<SevenTVResponse>('', {
			method: 'POST',
			body: JSON.stringify({ query })
		});

		const data = response?.data;

		const emotes: Emotes = new Map();

		for (const item of data?.emoteSets?.global?.emotes?.items || []) {
			emotes.set(item.alias, {
				id: item.id,
				name: item.alias,
				aspectRatio: item.emote.aspectRatio,
				url: `https://cdn.7tv.app/emote/${item.id}/2x.webp`
			});
		}

		for (const item of data?.users?.userByConnection?.style?.activeEmoteSet?.emotes?.items || []) {
			emotes.set(item.alias, {
				id: item.id,
				name: item.alias,
				aspectRatio: item.emote.aspectRatio,
				url: `https://cdn.7tv.app/emote/${item.id}/2x.webp`
			});
		}

		return emotes;
	}
}

const sevenTV = new SevenTV();

export default sevenTV;
