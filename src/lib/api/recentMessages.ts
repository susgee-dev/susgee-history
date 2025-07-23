import BaseApi from './base';

import provider from '@/lib/providers';
import { RecentMessagesResponse } from '@/types/api/recentMessages';

type GetOptions = {
	channel?: string;
	url?: string;
	provider?: string;
	limit?: number;
};

class RecentMessages extends BaseApi {
	constructor() {
		super('');
	}

	async get(options: GetOptions): Promise<string[]> {
		const { channel, url, provider: providerOption, limit: limitOption } = options;
		const limit = limitOption || provider.defaultLimit;
		let fetchUrl: string;
		let isDirectUrl = false;

		if (url) {
			isDirectUrl = true;
			fetchUrl = new URL(url).searchParams.has('raw')
				? url
				: `${url}${url.includes('?') ? '&raw' : '?raw'}`;
		} else if (channel) {
			let providerUrl = providerOption || provider.defaultProvider;

			if (providerUrl && providerUrl !== provider.defaultProvider) {
				const validatedUrl = provider.validateUrl(providerUrl);

				providerUrl = validatedUrl || provider.defaultProvider;
			}

			fetchUrl = `${providerUrl}${channel}?limit=${limit}`;
		} else {
			return [];
		}

		try {
			if (isDirectUrl) {
				const text = await this.fetchText(fetchUrl);

				if (!text) {
					return [];
				}

				return text.split('\n').filter((line) => line.trim() !== '');
			} else {
				const data = await this.fetch<RecentMessagesResponse>(fetchUrl);

				if (!data) {
					return [];
				}

				return data.messages || data;
			}
		} catch {
			return [];
		}
	}
}

const recentMessages = new RecentMessages();

export default recentMessages;
