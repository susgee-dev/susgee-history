export default class BaseApi {
	protected basePath: string;

	constructor(basePath: string) {
		this.basePath = basePath;
	}

	async fetch<T>(endpoint: string, options: any = {}) {
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
			return {
				status: response.status,
				error: true
			};
		}

		if (response.status === 204) {
			return {
				status: 204,
				error: false
			};
		}

		return await response.json();
	}
}
