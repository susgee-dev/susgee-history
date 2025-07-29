export type BetterTTVEmote = {
	id: string;
	code: string;
};

export type ChannelResponse = {
	channelEmotes: BetterTTVEmote[];
	sharedEmotes: BetterTTVEmote[];
};

export type GlobalEmotesResponse = BetterTTVEmote[];
