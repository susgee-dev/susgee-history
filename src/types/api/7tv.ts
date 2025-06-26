export interface SevenTVEmote {
	id: string;
	alias: string;
}

export interface SevenTVEmoteSet {
	id: string;
	name: string;
	capacity: number;
	items: SevenTVEmote[];
}

export interface SevenTVEmoteSetResponse {
	emote_set: SevenTVEmoteSet;
}

export interface SevenTVUser {
	id: string;
	username: string;
	display_name: string;
	created_at: number;
	avatar_url: string;
	biography: string;
	style: any;
	editors: Array<{
		id: string;
		permissions: number;
		visible: boolean;
		added_at: number;
	}>;
	roles: string[];
	connections: Array<{
		id: string;
		platform: string;
		username: string;
		display_name: string;
		linked_at: number;
		emote_capacity: number;
		emote_set_id: string;
	}>;
}

export interface SevenTVUserResponse {
	user: SevenTVUser;
}
