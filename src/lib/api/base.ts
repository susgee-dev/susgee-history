import { ApiRequestOptions } from '@/types/api/base';

export default class BaseApi {
	protected basePath: string;

	constructor(basePath: string) {
		this.basePath = basePath;
	}

	async fetch<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<null | T> {
		try {
			const response = await fetch(this.basePath + endpoint, {
				method: 'GET',
				headers: {
					'User-Agent': 'Susgeebot History (https://github.com/susgee-dev/susgee-history)',
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				...options,
				signal: AbortSignal.timeout(8000)
			});

			if (!response.ok) {
				return null;
			}

			if (response.status === 204) {
				return null;
			}

			return await response.json();
		} catch {
			return null;
		}
	}

	async fetchText(endpoint: string, options: ApiRequestOptions = {}): Promise<null | string> {
		try {
			const response = await fetch(this.basePath + endpoint, {
				method: 'GET',
				headers: {
					'User-Agent': 'Susgeebot History (https://github.com/susgee-dev/susgee-history)',
					...(options.headers || {})
				},
				...options,
				signal: AbortSignal.timeout(8000)
			});

			if (!response.ok) {
				return null;
			}

			if (response.status === 204) {
				return null;
			}

			return await response.text();
		} catch {
			return null;
		}
	}
}
