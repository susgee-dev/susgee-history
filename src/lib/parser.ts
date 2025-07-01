import logger from '@/lib/logger';
import { getBestName } from '@/lib/utils';
import {
	Cosmetics,
	Emote,
	MessageContext,
	MessageTypes,
	ParsedIRC,
	ParsedMessage,
	ProcessedWord,
	TwitchBadge
} from '@/types/message';

const fallbackColor = '#808080';

class Parser {
	private readonly handlers: Record<string, (parsed: ParsedIRC) => ParsedMessage | null> = {
		PRIVMSG: this.handlePrivMsg.bind(this),
		USERNOTICE: this.handleUserNotice.bind(this)
	};

	process(rawMessage: string, cosmetics: Cosmetics): ParsedMessage | null {
		const parsed = this.parseRaw(rawMessage);

		if (!parsed) return null;

		const handler = this.handlers[parsed.cmd];

		if (!handler) {
			logger.warn(`unhandled message type: ${JSON.stringify(rawMessage)}`);

			return null;
		}

		try {
			return handler({ ...parsed, cosmetics });
		} catch (error) {
			logger.error(`Error processing ${parsed.cmd}:`, error);

			return null;
		}
	}

	private parseRaw(raw: string): Omit<ParsedIRC, 'cosmetics'> | null {
		const match = raw.match(/^(?:@([^ ]+) )?(?::([^ ]+) )?([A-Z]+) (.+)$/);

		if (!match) return null;

		const [, tagsStr = '', prefix = '', cmd, rest] = match;

		const tags = new Map(
			tagsStr.split(';').map((tag) => {
				const [key, value = ''] = tag.split('=');

				return [key, this.safeDecode(value) || ''];
			})
		);

		return { cmd, tags, prefix, rest };
	}

	private safeDecode(v: string): string {
		try {
			return decodeURIComponent(v);
		} catch {
			return v;
		}
	}

	private handlePrivMsg({ tags, prefix, rest, cosmetics }: ParsedIRC): ParsedMessage | null {
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

		if (tags.get('reply-parent-msg-id')) {
			const username = tags.get('reply-parent-user-login') || '';
			const text = tags.get('reply-parent-msg-body')?.replaceAll('\\s', ' ') || '';

			context = { type: 'reply', text, username };
		}

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics);

		cosmetics.twitch.emotes = baseMessage.emotes;

		const processedMessage = this.processText(messageContent, cosmetics);

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

	private handleUserNotice({ tags, rest, cosmetics, prefix }: ParsedIRC): ParsedMessage | null {
		const login = tags.get('login') || prefix.match(/!([^@]+)@/)?.[1] || null;

		if (!login) return null;

		const displayName = tags.get('display-name') || login;
		const messageContent = rest.match(/#[^ ]+ ?:?(.*)$/)?.[1].trim() || '';

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics);
		const text = messageContent ? this.processText(messageContent, cosmetics) : [];

		const systemMsg = tags.get('system-msg')?.replaceAll('\\s', ' ') || '';
		const msgId = tags.get('msg-id') || '';

		let context: MessageContext | null = null;

		if (systemMsg) {
			context = { type: 'system', text: systemMsg };
		}

		const result: ParsedMessage = {
			...baseMessage,
			type: MessageTypes.USERNOTICE,
			text,
			msgId,
			context
		};

		const isSystemOnly = systemMsg && !text.length;

		if (isSystemOnly) {
			result.text = systemMsg
				.split(' ')
				.slice(1)
				.map((word) => ({ type: 'text', content: word }));
			result.addColon = false;
			result.context = null;
		}

		return result;
	}

	private createBaseMessage(
		tags: Map<string, string>,
		login: string,
		displayName: string,
		cosmetics: Cosmetics
	): ParsedMessage {
		return {
			type: MessageTypes.PRIVMSG,
			id: tags.get('id') || '',
			msgId: '',
			text: [],
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName,
			login,
			bestName: getBestName(displayName, login),
			color: tags.get('color') || fallbackColor,
			badges: this.parseBadges(tags.get('badges') || '', cosmetics),
			emotes: this.parseEmotes(tags.get('emotes') || ''),
			isAction: false,
			isFirstMessage: tags.get('first-msg') === '1',
			context: null,
			addColon: true
		};
	}

	private processText(message: string, cosmetics: Cosmetics): ProcessedWord[] {
		if (!message) return [];

		const processed: ProcessedWord[] = [];
		const twitchEmotes = cosmetics.twitch.emotes || [];
		const stvEmotes = cosmetics.sevenTv.emotes;

		const words = message.split(' ');
		let index = 0;

		for (const word of words) {
			const twitchEmote = twitchEmotes.find((e) => e.start === index);

			if (twitchEmote) {
				processed.push({
					type: 'emote',
					id: twitchEmote.emoteId,
					content: word,
					aspectRatio: 1,
					url: `https://static-cdn.jtvnw.net/emoticons/v2/${twitchEmote.emoteId}/default/dark/3.0`
				});
				index += word.length + 1;
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
				index += word.length + 1;
				continue;
			}

			if (/^https?:\/\//.test(word)) {
				processed.push({ type: 'link', content: word, url: word });
				index += word.length + 1;
				continue;
			}

			processed.push({ type: 'text', content: word });
			index += word.length + 1;
		}

		return processed;
	}

	private parseBadges(badgesStr: string, cosmetics: Cosmetics): TwitchBadge[] {
		if (!badgesStr) return [];

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
