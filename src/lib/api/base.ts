import { ApiRequestOptions } from '@/types/api/base';

export default class BaseApi {
	protected basePath: string;

	constructor(basePath: string) {
		this.basePath = basePath;
	}

	async fetch<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<null | T> {
		const response = await fetch(this.basePath + endpoint, {
			method: 'GET',
			headers: {
				'User-Agent': 'Susgeebot History (https://github.com/susgee-dev/susgee-history)',
				'Content-Type': 'application/json',
				...(options.headers || {})
			},
			...options
		});

		if (!response.ok) {
			return null;
		}

		if (response.status === 204) {
			return null;
		}

		return await response.json();
	}
}
