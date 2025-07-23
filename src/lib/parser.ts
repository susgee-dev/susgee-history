import logger from '@/lib/logger';
import { getBestName } from '@/lib/utils';
import {
	BaseMessage,
	ClearChatMessage,
	Cosmetics,
	Emote,
	MessageContext,
	MessageTypes,
	ParsedIRC,
	ParsedMessage,
	PrivateMessage,
	ProcessedWord,
	TwitchBadge,
	UserNoticeMessage
} from '@/types/message';

class Parser {
	private readonly fallbackColor = '#808080';

	private readonly handlers: Record<string, (parsed: ParsedIRC) => ParsedMessage | null> = {
		PRIVMSG: this.handlePrivMsg.bind(this),
		USERNOTICE: this.handleUserNotice.bind(this),
		CLEARCHAT: this.handleClearChat.bind(this)
	};

	public process(rawMessage: string, cosmetics: Cosmetics): ParsedMessage | null {
		const parsed = this.parseRaw(rawMessage);

		if (!parsed) return null;

		const handler = this.handlers[parsed.cmd];

		if (!handler) {
			logger.warn(`unhandled message type: ${rawMessage}`);

			return null;
		}

		try {
			return handler({ ...parsed, cosmetics });
		} catch (error) {
			logger.error(`Error processing ${parsed.cmd}:`, error);

			return null;
		}
	}

	private safeDecode(value: string): string {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	}

	private parseRaw(raw: string): Omit<ParsedIRC, 'cosmetics'> | null {
		if (raw.length < 4) return null;

		const hasTag = raw.charAt(0) === '@';
		const tagStart = hasTag ? raw.indexOf(' ') : -1;

		const prefixStart = raw.indexOf(':', tagStart + 1);
		const cmdStart = prefixStart !== -1 ? raw.indexOf(' ', prefixStart) : hasTag ? tagStart : 0;

		const tagsStr = hasTag ? raw.slice(1, tagStart).trim() : '';
		const prefix = prefixStart !== -1 ? raw.slice(prefixStart + 1, cmdStart).trim() : '';

		const cmdAndRest = raw.slice(cmdStart + 1).trim();
		const spaceIndex = cmdAndRest.indexOf(' ');

		const cmd = spaceIndex === -1 ? cmdAndRest : cmdAndRest.slice(0, spaceIndex);
		const rest = spaceIndex === -1 ? '' : cmdAndRest.slice(spaceIndex + 1);

		const tags = new Map<string, string>();

		if (tagsStr) {
			for (const tag of tagsStr.split(';')) {
				const [key, value = ''] = tag.split('=');

				tags.set(key, this.safeDecode(value));
			}
		}

		return { cmd, tags, prefix, rest };
	}

	private createBaseMessage(
		tags: Map<string, string>,
		login: string,
		displayName: string,
		cosmetics: Cosmetics
	): BaseMessage {
		return {
			id: tags.get('id') || '',
			text: [],
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName,
			login,
			bestName: getBestName(displayName, login),
			color: tags.get('color') || this.fallbackColor,
			badges: this.parseBadges(tags.get('badges') || '', tags.get('badge-info') || '', cosmetics),
			emotes: this.parseEmotes(tags.get('emotes') || ''),
			isFirstMessage: tags.get('first-msg') === '1'
		};
	}

	private parseBadges(
		badgesStr: string,
		badgesInfoStr: string,
		cosmetics: Cosmetics
	): TwitchBadge[] {
		if (!badgesStr) return [];

		const badgesInfo = new Map<string, string>(
			badgesInfoStr.split(',').map((badgeInfoStr) => {
				const [badgeType, version] = badgeInfoStr.split('/');

				return [badgeType, version];
			})
		);

		return badgesStr
			.split(',')
			.map((badgeStr) => {
				const [type, version] = badgeStr.split('/');
				const badgeKey = `${type}_${version}`;
				const badgeInfo = cosmetics.twitch.badges.get(badgeKey);

				if (!badgeInfo) return;

				let title = badgeInfo.title;

				const monthsBadgeTypes = ['subscriber', 'founder'];

				if (monthsBadgeTypes.includes(type) && badgesInfo.has(type)) {
					const months = badgesInfo.get(type);

					if (months && parseInt(months) > 1) {
						title += ` (${months} months)`;
					}
				}

				return {
					content: title,
					url: badgeInfo.url
				};
			})
			.filter((badge): badge is TwitchBadge => badge !== null);
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

	private processText(message: string, cosmetics: Cosmetics): ProcessedWord[] {
		if (!message) return [];

		const processed: ProcessedWord[] = [];
		const twitchEmotes = cosmetics.twitch.emotes || [];
		const stvEmotes = cosmetics.sevenTv.emotes;

		let index = 0;

		const wordRegex = /(\p{Emoji}|\bhttps?:\/\/\S+\b|\w+|\s+|[^\w\s])/gu;
		const parts = [...message.matchAll(wordRegex)].map((m) => m[0]);

		for (const word of parts) {
			const clean = word.trim();

			if (!clean) {
				index += word.length;
				continue;
			}

			const twitchEmote = twitchEmotes.find((e) => e.start === index);

			index += Array.from(word).length + 1;

			if (twitchEmote) {
				processed.push({
					type: 'emote',
					id: twitchEmote.emoteId,
					content: word,
					aspectRatio: 1,
					url: `https://static-cdn.jtvnw.net/emoticons/v2/${twitchEmote.emoteId}/default/dark/3.0`
				});
				continue;
			}

			const stvEmote = stvEmotes.get(word);

			if (stvEmote) {
				processed.push({
					type: 'emote',
					id: stvEmote.id,
					content: stvEmote.name,
					aspectRatio: stvEmote.aspectRatio,
					url: `https://cdn.7tv.app/emote/${stvEmote.id}/1x.webp`
				});
				continue;
			}

			if (/^https?:\/\//.test(word)) {
				processed.push({ type: 'link', content: word, url: word });
				continue;
			}

			if (/\p{Emoji}/u.test(word)) {
				processed.push({ type: 'emoji', content: word });
			} else {
				processed.push({ type: 'text', content: word });
			}

			index += word.length;
		}

		return processed;
	}

	private handlePrivMsg({ tags, prefix, rest, cosmetics }: ParsedIRC): PrivateMessage | null {
		const loginMatch = prefix.match(/!([a-z0-9_]{1,25})@/);

		if (!loginMatch) return null;
		const login = loginMatch[1];

		const messageMatch = rest.match(/#[^ ]+ ?:?(.*)$/);

		if (!messageMatch) return null;
		let messageContent = messageMatch[1].trim();

		const isAction =
			messageContent.startsWith('\u0001ACTION ') && messageContent.endsWith('\u0001');

		if (isAction) messageContent = messageContent.slice(8, -1).trim();

		const displayName = tags.get('display-name') || login;

		let context: MessageContext = null;

		const parentMsgId = tags.get('reply-parent-msg-id');

		if (parentMsgId) {
			const username = tags.get('reply-parent-user-login') || '';
			const text = tags.get('reply-parent-msg-body')?.replaceAll('\\s', ' ') || '';

			context = {
				id: parentMsgId,
				type: 'reply',
				text,
				username
			};
		}

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics);

		cosmetics.twitch.emotes = baseMessage.emotes;
		const processedMessage = this.processText(messageContent, cosmetics);

		// Remove @ mention at start if this is a reply
		if (context && processedMessage[0]?.content?.startsWith('@')) processedMessage.shift();

		return {
			...baseMessage,
			type: MessageTypes.PRIVMSG,
			text: processedMessage,
			isAction,
			addColon: !isAction,
			context
		};
	}

	private handleUserNotice({ tags, rest, cosmetics, prefix }: ParsedIRC): UserNoticeMessage | null {
		const login = tags.get('login') || prefix.match(/!([^@]+)@/)?.[1] || null;

		if (!login) return null;

		const displayName = tags.get('display-name') || login;
		const messageContent = rest.match(/#[^ ]+ ?:?(.*)$/)?.[1].trim() || '';

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics);

		cosmetics.twitch.emotes = baseMessage.emotes;
		const text = messageContent ? this.processText(messageContent, cosmetics) : [];

		const systemMsg = tags.get('system-msg')?.replaceAll('\\s', ' ') || '';
		const msgId = tags.get('msg-id') || '';

		let context: MessageContext | null = null;

		if (systemMsg) {
			context = { type: 'system', text: systemMsg };
		}

		const result: UserNoticeMessage = {
			...baseMessage,
			type: MessageTypes.USERNOTICE,
			text,
			msgId,
			context
		};

		const isSystemOnly = systemMsg && !text.length;

		if (isSystemOnly) {
			const words = systemMsg.split(' ');
			const systemWords = msgId === 'raid' ? words : words.slice(1);

			result.text = systemWords.map((word) => ({ type: 'text', content: word }));
			result.addColon = false;
			result.context = null;
		}

		return result;
	}

	private handleClearChat({ tags, rest }: ParsedIRC): ClearChatMessage | null {
		const targetUserMatch = rest.match(/#[^ ]+ (.+)$/);

		if (!targetUserMatch) return null;

		const targetUser = targetUserMatch[1].trim();

		const banDuration = tags.get('ban-duration')
			? parseInt(tags.get('ban-duration') || '0', 10)
			: undefined;

		const messageText = banDuration
			? `${targetUser} has been timed out for ${banDuration} seconds`
			: `${targetUser} has been banned`;

		const baseMessage: BaseMessage = {
			id: tags.get('rm-received-ts') || '',
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName: '',
			login: '',
			bestName: '',
			badges: [],
			emotes: [],
			isFirstMessage: false,
			text: messageText.split(' ').map((word) => ({ type: 'text', content: word }))
		};

		return {
			...baseMessage,
			type: MessageTypes.CLEARCHAT,
			targetUser,
			banDuration
		};
	}
}

const parser = new Parser();

export default parser;
