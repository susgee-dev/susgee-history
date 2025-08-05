import { BadgeMap, TwitchBadge, TwitchIRCEmote } from '@/types/api/helix';
import { Emotes } from '@/types/emotes';

export type ProcessedWord =
	| { type: 'text'; content: string }
	| { type: 'link'; content: string; url: string }
	| {
			type: 'emote';
			content: string;
			provider: string;
			id: string;
			url: string;
			aspectRatio: number;
	  };

export type Cosmetics = {
	twitch: {
		emotes?: TwitchIRCEmote[];
		badges: BadgeMap;
	};
	betterTtv: {
		emotes: Emotes;
	};
	frankerFazeZ: {
		emotes: Emotes;
	};
	sevenTv: {
		emotes: Emotes;
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

export type RawIRCData = {
	key: string;
	value: string;
};

export interface BaseMessage {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	color?: string;
	badges: TwitchBadge[];
	emotes: TwitchIRCEmote[];
	isFirstMessage: boolean;
	text: ProcessedWord[];
	rawIRC?: RawIRCData[];
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
