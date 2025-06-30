import { SevenTVEmoteMap } from '@/types/api/7tv';
import { BadgeMap } from '@/types/api/helix';

export type TwitchBadge = {
	content: string;
	url: string;
};

export enum MessageTypes {
	PRIVMSG = 'PRIVMSG',
	USERNOTICE = 'USERNOTICE'
}

export type BaseMessage = {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	color?: string;
	badges: TwitchBadge[];
	emotes: Emote[];
	roles: string[];
	isVip: boolean;
	isMod: boolean;
	isSubscriber: boolean;
	isFirstMessage: boolean;
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

export type ParsedPrivMsg = BaseMessage & {
	type: MessageTypes.PRIVMSG;
	text: ProcessedWord[];
	reply: null | {
		login: string;
		displayName: string;
		text: string;
	};
	isAction: boolean;
};

export type ParsedUserNotice = BaseMessage & {
	type: MessageTypes.USERNOTICE;
	text: string[];
	msgId: string;
	systemMsg: string;
	msgParams: Record<string, string>;
};

export type ParsedMessage = ParsedPrivMsg | ParsedUserNotice;

export type ChatMessageProps = {
	message: ParsedMessage;
};
