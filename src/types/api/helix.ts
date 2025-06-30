export type UserResponse = {
	data: User[];
};

export type User = {
	id: string;
	login: string;
	display_name: string;
};

export type BadgeMap = Map<string, string>;

export type TwitchBadgeVersion = {
	id: string;
	image_url_1x: string;
	image_url_2x: string;
	image_url_4x: string;
	title: string;
	description: string;
	click_action: string | null;
	click_url: string | null;
};

export type TwitchBadgeSet = {
	set_id: string;
	versions: {
		[versionId: string]: TwitchBadgeVersion;
	};
};

export type TwitchBadgesResponse = {
	data: TwitchBadgeSet[];
};

export type TwitchEmoteImages = {
	url_1x: string;
	url_2x: string;
	url_4x: string;
};

export type TwitchEmote = {
	id: string;
	name: string;
	images: TwitchEmoteImages;
};

export type TwitchEmotesResponse = {
	data: TwitchEmote[];
	template: string;
};

export type GlobalEmotesMap = {
	[emoteName: string]: {
		id: string;
		url: string;
	};
};
