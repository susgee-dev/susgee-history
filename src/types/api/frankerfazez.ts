export interface FfzEmote {
	id: number;
	name: string;
	height: number;
	width: number;
}

export interface FfzSet {
	id: number;
	title: string;
	emoticons: FfzEmote[];
}

export interface FfzGlobalResponse {
	sets: {
		[key: string]: FfzSet;
	};
}

export interface FfzChannelResponse {
	sets: {
		[key: string]: FfzSet;
	};
}
