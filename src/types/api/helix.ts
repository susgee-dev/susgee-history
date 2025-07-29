export type UserResponse = {
	data: {
		id: string;
		login: string;
		display_name: string;
	}[];
};

export type BadgeInfo = {
	url: string;
	title: string;
};

export type BadgeMap = Map<string, BadgeInfo>;

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

export type TwitchBadgesResponse = {
	data: {
		set_id: string;
		versions: {
			[versionId: string]: TwitchBadgeVersion;
		};
	}[];
};

export type TwitchIRCEmote = {
	emoteId: string;
	start: number;
	end: number;
	url: string;
};

export type TwitchBadge = {
	content: string;
	url: string;
};
