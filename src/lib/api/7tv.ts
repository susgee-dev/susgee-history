import BaseApi from './base';

import { SevenTVEmote } from '@/types/api/7tv';

class SevenTV extends BaseApi {
	constructor() {
		super('https://7tv.io/v4/gql');
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
}

const sevenTV = new SevenTV();

export default sevenTV;
