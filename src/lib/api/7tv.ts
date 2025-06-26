import BaseApi from "./base";
import { SevenTVEmoteSetResponse } from "@/types/api/7tv";


class SevenTV extends BaseApi {
	constructor() {
		super('https://7tv.io/v4/gql');
	}

	async getUserEmoteSet(twitchId: string): Promise<SevenTVEmoteSetResponse | null> {
		const userQuery = `{
			users {
				userByConnection(platform: TWITCH, platformId: "${twitchId}") {
					id
					style {
						activeEmoteSet {
							id
							name
							capacity
							emotes {
								items {
									id
									alias
								}
							}
						}
					}
				}
			}
		}`;

		const userResponse = await super.fetch<any>('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: userQuery,
				variables: { id: twitchId }
			})
		});


		if (!userResponse || !userResponse.data || !userResponse.data.users) {
			return null;
		}

        return {
            emote_set: userResponse.data.users.userByConnection.style.activeEmoteSet.emotes
        }

	}
}

const sevenTV = new SevenTV();

export default sevenTV;