import 'dotenv/config';

import BaseApi from './base';

import { RecentMessagesResponse } from '@/types/api/recentMessages';

class RecentMessages extends BaseApi {
	constructor() {
		super('https://recent-messages.robotty.de/api/v2/recent-messages/');
	}

	async get(channel: string): Promise<string[]> {
		const response = await super.fetch<RecentMessagesResponse>(`${channel}?limit=800`);

		if (!response) {
			return [];
		}

		return response.messages || [];
	}
}

const recentMessages = new RecentMessages();

export default recentMessages;
