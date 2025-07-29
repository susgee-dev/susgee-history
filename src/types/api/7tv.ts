export type SevenTvEmote = {
	id: string;
	alias: string;
	emote: {
		aspectRatio: number;
	};
};

export type SevenTvEmoteSet = {
	emotes: {
		items: SevenTvEmote[];
	};
};

export type SevenTVResponse = {
	data: {
		emoteSets: {
			emoteSet: SevenTvEmoteSet;
		};
		users: {
			userByConnection: {
				style: {
					activeEmoteSet: SevenTvEmoteSet;
				};
			};
		};
	};
};
