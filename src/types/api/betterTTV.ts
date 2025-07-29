export type BetterTTVEmote = {
	id: string;
	code: string;
};

export type ChannelResponse = {
	channelEmotes: BetterTTVEmote[];
};

export type GlobalEmotesResponse = BetterTTVEmote[];
