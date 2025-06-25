import 'dotenv/config';

import BaseApi from './base';

import {
	GlobalBadgesMap,
	TwitchBadgesResponse,
	TwitchBadgeVersion,
	UserResponse
} from '@/types/api/helix';

class Helix extends BaseApi {
	private readonly headers = {
		'Client-ID': process.env.HELIX_CLIENT_ID || '',
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
	};

	constructor() {
		super('https://api.twitch.tv/helix');
	}

	async getUserId(username: string): Promise<null | string> {
		const channels = await super.fetch<UserResponse>(`/users?login=${username}`, {
			headers: this.headers
		});

		return channels?.data?.[0]?.id || null;
	}

	async getChannelBadges(channelId: string): Promise<GlobalBadgesMap> {
		const response = await super.fetch<TwitchBadgesResponse>(
			`/chat/badges?broadcaster_id=${channelId}`,
			{
				headers: this.headers
			}
		);

		const result: GlobalBadgesMap = {};

		for (const set of (response as TwitchBadgesResponse).data) {
			for (const version of Object.values(set.versions) as TwitchBadgeVersion[]) {
				if (version?.id && version.image_url_1x) {
					result[`${set.set_id}_${version.id}`] = version.image_url_1x;
				}
			}
		}

		return result;
	}

	async getGlobalBadges(): Promise<GlobalBadgesMap> {
		const response = await super.fetch<TwitchBadgesResponse>('/chat/badges/global', {
			headers: this.headers
		});

		if (!response) {
			return {};
		}

		const result: GlobalBadgesMap = {};

		for (const set of response.data) {
			for (const version of Object.values(set.versions) as TwitchBadgeVersion[]) {
				if (version?.id && version.image_url_1x) {
					result[`${set.set_id}_${version.id}`] = version.image_url_1x;
				}
			}
		}

		return result;
	}
}

const helix = new Helix();

export default helix;
