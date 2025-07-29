export type Emote = {
	id: string;
	name: string;
	aspectRatio: number;
	url: string;
};

export type Emotes = Map<string, Emote>;
