import { SevenTVEmoteMap } from '@/types/api/7tv';
import { BadgeMap } from '@/types/api/helix';

export type TwitchBadge = {
	content: string;
	url: string;
};

export type ProcessedWord =
	| { type: 'text'; content: string }
	| { type: 'emote'; content: string; id: string; url: string; aspectRatio: number }
	| { type: 'link'; content: string; url: string };

export type Emote = {
	emoteId: string;
	start: number;
	end: number;
};

export type Cosmetics = {
	twitch: {
		emotes?: Emote[];
		badges: BadgeMap;
	};
	sevenTv: {
		emotes: SevenTVEmoteMap;
	};
};

export enum MessageTypes {
	CLEARCHAT = 'CLEARCHAT',
	PRIVMSG = 'PRIVMSG',
	USERNOTICE = 'USERNOTICE'
}

export type MessageContext = {
	type: 'reply' | 'system';
	text: string;
	username?: string;
	id?: string;
} | null;

export interface BaseMessage {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	color?: string;
	badges: TwitchBadge[];
	emotes: Emote[];
	isFirstMessage: boolean;
	text: ProcessedWord[];
}

export interface PrivateMessage extends BaseMessage {
	type: MessageTypes.PRIVMSG;
	isAction: boolean;
	context: MessageContext;
	addColon: boolean;
}

export interface UserNoticeMessage extends BaseMessage {
	type: MessageTypes.USERNOTICE;
	msgId: string;
	context: MessageContext;
	addColon?: boolean;
}

export interface ClearChatMessage extends BaseMessage {
	type: MessageTypes.CLEARCHAT;
	targetUser: string;
	banDuration?: number;
}

export type ParsedMessage = PrivateMessage | UserNoticeMessage | ClearChatMessage;

export type ParsedIRC = {
	cmd: string;
	tags: Map<string, string>;
	prefix: string;
	rest: string;
	cosmetics: Cosmetics;
};
