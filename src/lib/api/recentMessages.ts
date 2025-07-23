import BaseApi from './base';

import provider from '@/lib/providers';
import { RecentMessagesResponse } from '@/types/api/recentMessages';

class RecentMessages extends BaseApi {
	constructor() {
		super('');
	}

	async get(channel: string, options?: { provider?: string; limit?: number }): Promise<string[]> {
		let providerUrl = options?.provider || provider.defaultProvider;
		const limit = options?.limit || provider.defaultLimit;

		if (providerUrl && providerUrl !== provider.defaultProvider) {
			const validatedUrl = provider.validateUrl(providerUrl);

			providerUrl = validatedUrl || provider.defaultProvider;
		}

		const url = `${providerUrl}${channel}?limit=${limit}`;

		try {
			const data = await this.fetch<RecentMessagesResponse>(url);

			if (!data) {
				return [];
			}

			return data.messages || data;
		} catch {
			return [];
		}
	}
}

const recentMessages = new RecentMessages();

export default recentMessages;
