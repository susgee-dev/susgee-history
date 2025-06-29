import BaseApi from './base';

import { SevenTVEmote } from '@/types/api/7tv';

class SevenTV extends BaseApi {
	constructor() {
		super('https://7tv.io/v4/gql');
	}

	private async fetchExternal<T>(url: string): Promise<null | T> {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'User-Agent': 'Susgeebot History (https://github.com/susgee-dev/susgee-history)',
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			return null;
		}

		if (response.status === 204) {
			return null;
		}

		return await response.json();
	}

	async getChannelEmotes(twitchId: string): Promise<SevenTVEmote[]> {
		const query = `{
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

		const response = await super.fetch<any>('', {
			method: 'POST',
			body: JSON.stringify({ query })
		});

		const emotes = response.data.users.userByConnection?.style?.activeEmoteSet?.emotes?.items;

		return emotes || [];
	}

	async getGlobalEmotes(): Promise<SevenTVEmote[]> {
		const globalEmoteSetResponse = await this.fetchExternal<any>(
			'https://7tv.io/v3/emote-sets/global'
		);

		if (!globalEmoteSetResponse || !globalEmoteSetResponse.id) {
			return [];
		}

		const globalEmoteSetId = globalEmoteSetResponse.id;

		const query = `{
			emoteSets {
				emoteSet(id: "${globalEmoteSetId}") {
					ownerId
					id
					name
					capacity
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
		}`;

		const response = await super.fetch<any>('', {
			method: 'POST',
			body: JSON.stringify({ query })
		});

		const emotes = response.data.emoteSets.emoteSet?.emotes?.items;

		return emotes || [];
	}
}

const sevenTV = new SevenTV();

export default sevenTV;
