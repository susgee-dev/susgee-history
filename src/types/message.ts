export type TwitchBadge = {
	type: string;
	version?: string;
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
	roles: string[];
	isVip: boolean;
	isMod: boolean;
	isSubscriber: boolean;
	isFirstMessage: boolean;
};

export type ParsedPrivMsg = BaseMessage & {
	type: MessageTypes.PRIVMSG;
	message: string;
	reply: null | {
		login: string;
		displayName: string;
		text: string;
	};
	isAction: boolean;
};

export type ParsedUserNotice = BaseMessage & {
	type: MessageTypes.USERNOTICE;
	message: string;
	msgId: string;
	systemMsg: string;
	msgParams: Record<string, string>;
};

export type ParsedMessage = ParsedPrivMsg | ParsedUserNotice;

export type ChatMessageProps = {
	message: ParsedMessage;
	badges: Record<string, string>;
};
