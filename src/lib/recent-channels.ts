const storageKey = 'recentChannels';
const maxChannels = 8;

export function loadRecentChannels(): string[] {
	try {
		const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');

		return Array.isArray(stored) ? stored.filter((entry) => typeof entry === 'string') : [];
	} catch {
		return [];
	}
}

export function saveRecentChannel(channel: string): string[] {
	const channels = [channel, ...loadRecentChannels().filter((entry) => entry !== channel)].slice(
		0,
		maxChannels
	);

	writeRecentChannels(channels);

	return channels;
}

export function writeRecentChannels(channels: string[]) {
	try {
		localStorage.setItem(storageKey, JSON.stringify(channels));
	} catch {}
}
