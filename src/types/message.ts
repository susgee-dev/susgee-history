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
	PRIVMSG = 'PRIVMSG',
	USERNOTICE = 'USERNOTICE'
}

export type MessageContext = {
	type: 'reply' | 'system';
	text: string;
	username?: string;
} | null;

export type ParsedMessage = {
	type: MessageTypes;
	id: string;
	msgId: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	color?: string;
	badges: TwitchBadge[];
	emotes: Emote[];
	roles: string[];
	isFirstMessage: boolean;

	text: ProcessedWord[];
	isAction: boolean;

	context: MessageContext;
	addColon: boolean;
};

export type ChatMessageProps = {
	message: ParsedMessage;
};
