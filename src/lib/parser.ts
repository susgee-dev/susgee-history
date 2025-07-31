import logger from '@/lib/logger';
import { getBestName } from '@/lib/utils';
import { TwitchBadge, TwitchIRCEmote } from '@/types/api/helix';
import {
	BaseMessage,
	ClearChatMessage,
	Cosmetics,
	MessageContext,
	MessageTypes,
	ParsedIRC,
	ParsedMessage,
	PrivateMessage,
	ProcessedWord,
	RawIRCData,
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

	private createIrcData(
		prefix: string,
		command: string,
		args: string[],
		tagsRecord: Record<string, string>
	): RawIRCData[] {
		const ircData: RawIRCData[] = [];

		const username = prefix ? prefix.split('!')[0] : '';

		ircData.push({ key: 'source', value: prefix });
		ircData.push({ key: 'command', value: command });
		ircData.push({ key: 'username', value: username });

		if (args.length > 0) {
			ircData.push({ key: 'channel', value: args[0] });
			if (args.length > 1) {
				ircData.push({ key: 'message', value: args[1] });
			}
		}

		const sortedTags = Object.entries(tagsRecord).sort(([a], [b]) => a.localeCompare(b));

		for (const [key, value] of sortedTags) {
			ircData.push({ key, value });
		}

		return ircData;
	}

	private createBaseMessage(
		tags: Map<string, string>,
		login: string,
		displayName: string,
		cosmetics: Cosmetics,
		parsed?: Omit<ParsedIRC, 'cosmetics'>
	): BaseMessage {
		const tagsRecord: Record<string, string> = {};

		if (parsed?.tags) {
			for (const [key, value] of parsed.tags.entries()) {
				tagsRecord[key] = value;
			}
		}

		const args: string[] = [];

		if (parsed?.rest) {
			const channelMatch = parsed.rest.match(/(#\S+)/);

			if (channelMatch) {
				args.push(channelMatch[1]);
			}

			const messageMatch = parsed.rest.match(/#\S+\s+:(.+)$/);

			if (messageMatch) {
				args.push(messageMatch[1]);
			}
		}

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
			isFirstMessage: tags.get('first-msg') === '1',
			rawIRC: parsed ? this.createIrcData(parsed.prefix, parsed.cmd, args, tagsRecord) : undefined
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

	private parseEmotes(emotesStr: string): TwitchIRCEmote[] {
		if (!emotesStr) return [];

		return emotesStr.split('/').flatMap((emoteStr) => {
			const [emoteId, sliceParts] = emoteStr.split(':');

			return sliceParts.split(',').map((slicePart) => {
				const [start, end] = slicePart.split('-').map(Number);

				return {
					emoteId,
					start,
					end,
					url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`
				};
			});
		});
	}

	private processText(message: string, cosmetics: Cosmetics): ProcessedWord[] {
		if (!message) return [];

		const processed: ProcessedWord[] = [];
		const twitchEmotes = cosmetics.twitch.emotes || [];
		const stvEmotes = cosmetics.sevenTv.emotes;
		const bttvEmotes = cosmetics.betterTtv.emotes;
		const ffzEmotes = cosmetics.frankerFazeZ.emotes;

		const words = message.split(' ');
		let index = 0;

		for (const word of words) {
			const twitchEmote = twitchEmotes.find((e) => e.start === index);

			index += Array.from(word).length + 1;

			if (twitchEmote) {
				processed.push({
					type: 'emote',
					id: twitchEmote.emoteId,
					content: word,
					aspectRatio: 1,
					url: twitchEmote.url
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
					url: stvEmote.url
				});
				continue;
			}

			const bttvEmote = bttvEmotes.get(word);

			if (bttvEmote) {
				processed.push({
					type: 'emote',
					id: bttvEmote.id,
					content: bttvEmote.name,
					aspectRatio: bttvEmote.aspectRatio,
					url: bttvEmote.url
				});
				continue;
			}

			const ffzEmote = ffzEmotes.get(word);

			if (ffzEmote) {
				processed.push({
					type: 'emote',
					id: ffzEmote.id,
					content: ffzEmote.name,
					aspectRatio: ffzEmote.aspectRatio,
					url: ffzEmote.url
				});
				continue;
			}

			if (/^https?:\/\//.test(word)) {
				processed.push({ type: 'link', content: word, url: word });
				continue;
			}

			processed.push({ type: 'text', content: word });
		}

		return processed;
	}

	private handlePrivMsg({ tags, prefix, rest, cosmetics, cmd }: ParsedIRC): PrivateMessage | null {
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

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics, {
			tags,
			prefix,
			rest,
			cmd
		});

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

	private handleUserNotice({
		tags,
		rest,
		cosmetics,
		prefix,
		cmd
	}: ParsedIRC): UserNoticeMessage | null {
		const login = tags.get('login') || prefix.match(/!([^@]+)@/)?.[1] || null;

		if (!login) return null;

		const displayName = tags.get('display-name') || login;
		const messageContent = rest.match(/#[^ ]+ ?:?(.*)$/)?.[1].trim() || '';

		const baseMessage = this.createBaseMessage(tags, login, displayName, cosmetics, {
			tags,
			prefix,
			rest,
			cmd
		});

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

	private handleClearChat({ tags, rest, prefix, cmd }: ParsedIRC): ClearChatMessage | null {
		const targetUserMatch = rest.match(/#[^ ]+ (.+)$/);

		if (!targetUserMatch) return null;

		const targetUser = targetUserMatch[1].trim();

		const banDuration = tags.get('ban-duration')
			? parseInt(tags.get('ban-duration') || '0', 10)
			: undefined;

		const messageText = banDuration
			? `${targetUser} has been timed out for ${banDuration} seconds`
			: `${targetUser} has been banned`;

		const tagsRecord: Record<string, string> = {};

		for (const [key, value] of tags.entries()) {
			tagsRecord[key] = value;
		}

		const args: string[] = [];

		const channelMatch = rest.match(/(#\S+)/);

		if (channelMatch) {
			args.push(channelMatch[1]);
		}

		const baseMessage: BaseMessage = {
			id: tags.get('rm-received-ts') || '',
			timestamp: parseInt(tags.get('tmi-sent-ts') || '0', 10),
			displayName: '',
			login: '',
			bestName: '',
			badges: [],
			emotes: [],
			isFirstMessage: false,
			text: messageText.split(' ').map((word) => ({ type: 'text', content: word })),
			rawIRC: this.createIrcData(prefix, cmd, args, tagsRecord)
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
