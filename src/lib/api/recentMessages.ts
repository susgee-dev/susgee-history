import 'dotenv/config';

import BaseApi from './base';

import { RecentMessagesResponse } from '@/types/api/recentMessages';

class RecentMessages extends BaseApi {
	private defaultProvider = 'https://recent-messages.robotty.de/api/v2/recent-messages/';
	private defaultLimit = 800;

	constructor() {
		super('https://recent-messages.robotty.de/api/v2/recent-messages/');
	}

	async get(channel: string, options?: { provider?: string; limit?: number }): Promise<string[]> {
		let provider = options?.provider || this.defaultProvider;
		const limit = options?.limit || this.defaultLimit;

		// Ensure provider URL ends with a slash
		if (provider && !provider.endsWith('/')) {
			provider = provider + '/';
		}

		// Build the full URL directly instead of changing basePath
		const fullUrl = `${provider}${channel}?limit=${limit}`;
		
		try {
			const response = await fetch(fullUrl, {
				method: 'GET',
				headers: {
					'User-Agent': 'Susgeebot History (https://github.com/susgee-dev/susgee-history)',
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				return [];
			}

			if (response.status === 204) {
				return [];
			}

			const data = await response.json() as RecentMessagesResponse;

			if (!data) {
				return [];
			}

			return data.messages || [];
		} catch (error) {
			return [];
		}
	}
}

const recentMessages = new RecentMessages();

export default recentMessages;
