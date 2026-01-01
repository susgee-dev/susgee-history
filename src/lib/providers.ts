type ProviderOption = {
	label: string;
	value: string;
	description: string;
};

class Providers {
	readonly providers = {
		ROBOTTY: 'https://recent-messages.robotty.de/api/v2/recent-messages/',
		ZNEIX: 'https://recent-messages.zneix.eu/api/v2/recent-messages/',
		LILB: 'https://rm.lilb.dev/api/v2/recent-messages/',
		ZONIAN: 'https://logs.zonian.dev/rm/',
		CUSTOM: 'custom recent-messages api',
		DIRECT_LOGS: 'direct logs url'
	} as const;

	readonly defaultProvider: string;
	readonly defaultLimit: number;
	readonly defaultReverseOrder: boolean;
	readonly options: ProviderOption[];

	constructor() {
		this.defaultProvider = this.providers.ROBOTTY;
		this.defaultLimit = 800;
		this.defaultReverseOrder = true;

		this.options = [
			{
				label: 'Robotty (Default)',
				value: this.providers.ROBOTTY,
				description: 'recent-messages.robotty.de'
			},
			{
				label: 'Zneix',
				value: this.providers.ZNEIX,
				description: 'recent-messages.zneix.eu'
			},
			{
				label: 'lilb',
				value: this.providers.LILB,
				description: 'rm.lilb.dev'
			},
			{
				label: 'Zonian',
				value: this.providers.ZONIAN,
				description: 'logs.zonian.dev'
			},
			{
				label: 'Custom URL',
				value: this.providers.CUSTOM,
				description: 'Enter your own API endpoint'
			},
			{
				label: 'Logs URL',
				value: this.providers.DIRECT_LOGS,
				description: 'Enter a logs URL'
			}
		];
	}

	validateUrl(providerUrl: string): string | null {
		if (!providerUrl) return null;

		if (!providerUrl.endsWith('/')) {
			return providerUrl + '/';
		}

		return providerUrl;
	}

	getUrl(selectedProvider: string, customProvider?: string): string | null {
		if (selectedProvider === this.defaultProvider) {
			return null;
		}

		if (selectedProvider === this.providers.CUSTOM) {
			if (!customProvider?.trim()) {
				return null;
			}

			return this.validateUrl(customProvider) || null;
		}

		if (selectedProvider === this.providers.DIRECT_LOGS) {
			if (!customProvider?.trim()) {
				return null;
			}

			return customProvider.trim();
		}

		return selectedProvider;
	}
}

const provider = new Providers();

export default provider;
