import 'dotenv/config';

import BaseApi from './base';

interface RecentMessagesResponse {
	messages: string[];
	error: null | string;
	error_code: null | number;
}

class RecentMessages extends BaseApi {
	constructor() {
		super('https://recent-messages.robotty.de/api/v2/recent-messages/');
	}

	async get(channel: string): Promise<string[]> {
		const response = await super.fetch<RecentMessagesResponse>(`${channel}?limit=800`);

		return response?.messages || [];
	}
}

const recentMessages = new RecentMessages();

export default recentMessages;
