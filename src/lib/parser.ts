import logger from '@/lib/logger';
import { getBestName } from '@/lib/utils';
import {
	BaseMessage,
	Cosmetics,
	Emote,
	MessageTypes,
	ParsedMessage,
	ParsedPrivMsg,
	ParsedUserNotice,
	ProcessedWord,
	TwitchBadge
} from '@/types/message';

class Parser {
	private fallbackColor = '#808080';

	process(rawMessage: string, cosmetics: Cosmetics): ParsedMessage | null {
		try {
			const privMsgSplitIndex = rawMessage.indexOf(' PRIVMSG ');

			if (privMsgSplitIndex !== -1) {
				return this.processPrivMsg(rawMessage, privMsgSplitIndex, cosmetics);
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

	private processPrivMsg(
		rawMessage: string,
		msgSplitIndex: number,
		cosmetics: any
	): ParsedPrivMsg | null {
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

			const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics);

			cosmetics.twitch.emotes = baseMessage.emotes;

			const processedMessage = this.processText(messageContent, cosmetics);

			// remove @user if it's a reply
			if (reply && processedMessage[0]?.content?.startsWith('@')) {
				processedMessage.shift();
			}

			return {
				...baseMessage,
				type: MessageTypes.PRIVMSG,
				text: processedMessage,
				isAction,
				reply
			};
		} catch (error) {
			logger.error('Error processing PRIVMSG:', error);

			return null;
		}
	}

	private processText(message: string, cosmetics: Cosmetics): ProcessedWord[] {
		if (!message) return [];

		const processedWords: ProcessedWord[] = [];

		const twitchEmotes = cosmetics.twitch.emotes || [];
		const stvEmotes = cosmetics.sevenTv.emotes;

		const words = message.split(' ');
		let currentMessageIndex = 0;

		for (const word of words) {
			const twitchEmote = twitchEmotes.find((emote) => emote.start === currentMessageIndex);

			if (twitchEmote) {
				processedWords.push({
					type: 'emote',
					id: twitchEmote.emoteId,
					content: word,
					aspectRatio: 1,
					url: `https://static-cdn.jtvnw.net/emoticons/v2/${twitchEmote.emoteId}/default/dark/3.0`
				});

				currentMessageIndex += word.length + 1;
				continue;
			}

			const stvEmote = stvEmotes.get(word);

			if (stvEmote) {
				processedWords.push({
					type: 'emote',
					id: stvEmote.id,
					content: stvEmote.name,
					aspectRatio: stvEmote.aspectRatio,
					url: `https://cdn.7tv.app/emote/${stvEmote.id}/1x.webp`
				});

				currentMessageIndex += word.length + 1;
				continue;
			}

			if (/^https?:\/\//.test(word)) {
				processedWords.push({
					type: 'link',
					content: word,
					url: word
				});

				currentMessageIndex += word.length + 1;
				continue;
			}

			currentMessageIndex += word.length + 1;
			processedWords.push({ type: 'text', content: word });
		}

		return processedWords;
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
				text: messageContent.split(' ').filter(Boolean),
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
		displayName: string,
		cosmetics?: Cosmetics
	): BaseMessage {
		return {
			id: tags.get('id') || '',
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName,
			login,
			bestName: getBestName(displayName, login),
			color: tags.get('color') || this.fallbackColor,
			badges: this.parseBadges(tags.get('badges') || '', cosmetics),
			emotes: this.parseEmotes(tags.get('emotes') || ''),
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

	private parseBadges(badgesStr: string, cosmetics?: Cosmetics): TwitchBadge[] {
		if (!badgesStr || !cosmetics) return [];

		return badgesStr
			.split(',')
			.map((badgeStr) => {
				const [type, version] = badgeStr.split('/');
				const badgeKey = `${type}_${version}`;
				const url = cosmetics.twitch.badges.get(badgeKey);

				if (!url) return;

				return {
					content: type,
					url
				};
			})
			.filter((badge): badge is TwitchBadge => badge !== null);
	}

	private parseRoles(tags: Map<string, string>): string[] {
		const roles: string[] = [];

		if (tags.get('subscriber') === '1') roles.push('subscriber');
		if (tags.get('mod') === '1') roles.push('moderator');
		if (tags.get('vip') === '1') roles.push('vip');
		if (tags.get('first-msg') === '1') roles.push('first-time');

		return roles;
	}

	private parseEmotes(emotesStr: string): Emote[] {
		if (!emotesStr) return [];

		return emotesStr.split('/').flatMap((emoteStr) => {
			const [emoteId, sliceParts] = emoteStr.split(':');

			return sliceParts.split(',').map((slicePart) => {
				const [start, end] = slicePart.split('-').map(Number);

				return {
					emoteId,
					start,
					end
				};
			});
		});
	}
}

const parser = new Parser();

export default parser;
