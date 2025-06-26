import logger from '@/lib/logger';
import { getBestName } from '@/lib/utils';
import {
	BaseMessage,
	MessageTypes,
	ParsedMessage,
	ParsedPrivMsg,
	ParsedUserNotice,
	TwitchBadge
} from '@/types/message';

class Parser {
	private badgeCache = new Map<string, TwitchBadge>();
	private fallbackColor = '#808080';

	process(rawMessage: string): ParsedMessage | null {
		try {
			const privMsgSplitIndex = rawMessage.indexOf(' PRIVMSG ');

			if (privMsgSplitIndex !== -1) {
				return this.processPrivMsg(rawMessage, privMsgSplitIndex);
			}

			const userNoticeSplitIndex = rawMessage.indexOf(' USERNOTICE ');

			if (userNoticeSplitIndex !== -1) {
				return this.processUserNotice(rawMessage, userNoticeSplitIndex);
			}

			logger.warn(`unhandled message type: ${rawMessage}`);

			return null;
		} catch {
			return null;
		}
	}

	private processPrivMsg(rawMessage: string, msgSplitIndex: number): ParsedPrivMsg | null {
		try {
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
				const replyDisplayName = tags.get('reply-parent-display-name') || '';
				const replyLogin = tags.get('reply-parent-user-login') || '';
				const text = tags.get('reply-parent-msg-body')?.replaceAll('\\s', ' ') || '';

				reply = {
					text,
					login: replyLogin,
					displayName: replyDisplayName
				};
			}

			if (reply && messageContent.startsWith('@')) {
				const spaceIndex = messageContent.indexOf(' ');

				if (spaceIndex !== -1) {
					messageContent = messageContent.slice(spaceIndex + 1).trim();
				}
			}

			const baseMessage = this.createBaseMessage(tags, login, displayName);

			return {
				...baseMessage,
				type: MessageTypes.PRIVMSG,
				message: messageContent,
				isAction,
				reply
			};
		} catch (error) {
			logger.error('Error processing PRIVMSG:', error);

			return null;
		}
	}

	private processUserNotice(rawMessage: string, msgSplitIndex: number): ParsedUserNotice | null {
		try {
			const prefixAndTags = rawMessage.substring(0, msgSplitIndex);
			const tagsPart = prefixAndTags.startsWith('@') ? prefixAndTags.split(' ')[0] : '';
			const loginMatch = rawMessage.match(/:[^!]+!([^@]+)@/) || rawMessage.match(/login=([^;]+)/);

			if (!loginMatch) return null;
			const login = loginMatch[1];

			const messageMatch = rawMessage.match(/USERNOTICE #[^ ]+ ?:?(.*)$/);
			const messageContent = messageMatch ? messageMatch[1].trim() : '';

			const tags = this.parseTags(tagsPart);
			const displayName = tags.get('display-name') || login;

			const msgId = tags.get('msg-id') || '';
			const systemMsg = tags.get('system-msg')?.replaceAll('\\s', ' ') || '';

			const msgParams: Record<string, string> = {};

			tags.forEach((value, key) => {
				if (key.startsWith('msg-param-')) {
					const paramName = key.replace('msg-param-', '');

					msgParams[paramName] = value;
				}
			});

			const baseMessage = this.createBaseMessage(tags, login, displayName);

			return {
				...baseMessage,
				type: MessageTypes.USERNOTICE,
				message: messageContent,
				msgId,
				systemMsg,
				msgParams
			};
		} catch (error) {
			logger.error('Error processing USERNOTICE:', error);

			return null;
		}
	}

	private createBaseMessage(
		tags: Map<string, string>,
		login: string,
		displayName: string
	): BaseMessage {
		return {
			id: tags.get('id') || '',
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName,
			login,
			bestName: getBestName(displayName, login),
			color: tags.get('color') || this.fallbackColor,
			badges: this.parseBadges(tags.get('badges') || ''),
			roles: this.parseRoles(tags),
			isVip: tags.get('vip') === '1',
			isMod: tags.get('mod') === '1',
			isSubscriber: tags.get('subscriber') === '1',
			isFirstMessage: tags.get('first-msg') === '1'
		};
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

export function processWithEmotes(message: string, emotes: Array<{ id: string; alias: string }>): ParsedMessage | null {
	const parsed = parser.process(message);
	if (!parsed) return null;

	const emoteMap = new Map<string, string>();
	emotes.forEach(emote => {
		emoteMap.set(emote.alias.toLowerCase(), emote.id);
	});

	const words = parsed.message.split(' ');
	const processedWords = words.map(word => {
		const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
		const emoteId = emoteMap.get(cleanWord);
		
		if (emoteId) {
			return {
				type: 'emote' as const,
				id: emoteId,
				alias: word,
				url: `https://cdn.7tv.app/emote/${emoteId}/1x.avif`
			};
		}
		
		return {
			type: 'text' as const,
			content: word
		};
	});

	return {
		...parsed,
		processedContent: processedWords
	};
}
