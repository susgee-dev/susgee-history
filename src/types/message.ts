export type TwitchBadge = {
	type: string;
	version?: string;
};

export type ParsedMessage = {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	message: string;
	isAction: boolean;
	color?: string;
	badges: TwitchBadge[];
	roles: string[];
	isVip: boolean;
	isMod: boolean;
	isSubscriber: boolean;
	isFirstMessage: boolean;
};

export type ChatMessageProps = {
	message: ParsedMessage;
	badges: Record<string, string>;
};
