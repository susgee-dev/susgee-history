import { getBestName } from '@/lib/utils';
import { ParsedMessage, TwitchBadge } from '@/types/message';

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
			let messageContent = messageMatch[1].trim();

			const isAction =
				messageContent.startsWith('\u0001ACTION ') && messageContent.endsWith('\u0001');

			if (isAction) {
				messageContent = messageContent.slice(8, -1).trim();
			}

			const tags = this.parseTags(tagsPart);
			const displayName = tags.get('display-name') || login;

			let reply = null;

			if (tags.get('reply-parent-msg-id')) {
				const displayName = tags.get('reply-parent-display-name') || '';
				const login = tags.get('reply-parent-user-login') || '';
				const text = tags.get('reply-parent-msg-body') || '';

				reply = {
					text,
					login,
					displayName
				};
			}

			if (reply && messageContent.startsWith('@')) {
				const spaceIndex = messageContent.indexOf(' ');

				if (spaceIndex !== -1) {
					messageContent = messageContent.slice(spaceIndex + 1).trim();
				}
			}

			return {
				id: tags.get('id') || '',
				timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
				displayName,
				login,
				bestName: getBestName(displayName, login),
				message: messageContent,
				isAction,
				color: tags.get('color') || this.fallbackColor,
				badges: this.parseBadges(tags.get('badges') || ''),
				roles: this.parseRoles(tags),
				isVip: tags.get('vip') === '1',
				isMod: tags.get('mod') === '1',
				isSubscriber: tags.get('subscriber') === '1',
				isFirstMessage: tags.get('first-msg') === '1',
				reply
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
