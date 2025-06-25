interface TwitchBadge {
	type: string;
	version?: string;
}

interface ParsedMessage {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	message: string;
	color?: string;
	badges: TwitchBadge[];
	roles: string[];
	isVip: boolean;
	isMod: boolean;
	isSubscriber: boolean;
	isFirstMessage: boolean;
}

class Parser {
	private badgeCache = new Map<string, TwitchBadge>();
	private fallbackColor = '#808080';

	process(rawMessage: string): ParsedMessage | null {
		try {
			const msgSplitIndex = rawMessage.indexOf(' PRIVMSG ');

			if (msgSplitIndex === -1) return null;

			const prefixAndTags = rawMessage.substring(0, msgSplitIndex);
			const tagsPart = prefixAndTags.startsWith('@') ? prefixAndTags.split(' ')[0] : '';
			const loginMatch = rawMessage.match(/:[^!]+!([^@]+)@/);

			if (!loginMatch) return null;
			const login = loginMatch[1];

			const messageMatch = rawMessage.match(/PRIVMSG #[^ ]+ ?:?(.*)$/);

			if (!messageMatch) return null;
			const messageContent = messageMatch[1].trim();

			const tags = this.parseTags(tagsPart);
			const displayName = tags.get('display-name') || login;

			return {
				id: tags.get('id') || '',
				timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
				displayName,
				login,
				bestName: displayName?.toLowerCase() === login ? displayName : `${displayName} (${login})`,
				message: messageContent,
				color: tags.get('color') || this.fallbackColor,
				badges: this.parseBadges(tags.get('badges') || ''),
				roles: this.parseRoles(tags),
				isVip: tags.get('vip') === '1',
				isMod: tags.get('mod') === '1',
				isSubscriber: tags.get('subscriber') === '1',
				isFirstMessage: tags.get('first-msg') === '1'
			};
		} catch {
			return null;
		}
	}

	private parseTags(tagsPart: string): Map<string, string> {
		const tagsMap = new Map<string, string>();

		if (!tagsPart.startsWith('@')) return tagsMap;

		const tags = tagsPart.slice(1).split(';');

		for (const tag of tags) {
			const [key, value = ''] = tag.split('=');

			tagsMap.set(key, decodeURIComponent(value));
		}

		return tagsMap;
	}

	private parseBadges(badgesStr: string): TwitchBadge[] {
		if (!badgesStr) return [];

		return badgesStr.split(',').map((badgeStr) => {
			const [type, version] = badgeStr.split('/');
			const cacheKey = `${type}-${version}`;

			if (this.badgeCache.has(cacheKey)) return this.badgeCache.get(cacheKey)!;

			const badge = { type, version };

			this.badgeCache.set(cacheKey, badge);

			return badge;
		});
	}

	private parseRoles(tags: Map<string, string>): string[] {
		const roles: string[] = [];

		if (tags.get('subscriber') === '1') roles.push('subscriber');
		if (tags.get('mod') === '1') roles.push('moderator');
		if (tags.get('vip') === '1') roles.push('vip');
		if (tags.get('first-msg') === '1') roles.push('first-time');

		return roles;
	}
}

const parser = new Parser();

export default parser;
