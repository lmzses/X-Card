// types.ts

export interface TwitterEntityUrl {
	display_url: string;
	expanded_url: string;
	url: string;
	indices: number[];
}

export interface TwitterEntities {
	description: {
		urls: TwitterEntityUrl[];
	};
	url: {
		urls: TwitterEntityUrl[];
	};
}

export interface TwitterStats {
	name: string;
	username: string;
	avatarUrl?: string;
	bannerUrl?: string;
	bio?: string;
	location?: string;
	website?: string;
	joinDate?: string;
	following: number;
	followers: number;
	tweets: number;
	likes: number;
	bookmarks?: number;
	mediaCount?: number;
	highlightedLabel?: {
		badge?: {
			url?: string;
			description: string;
			userLabelType: string;
			userLabelDisplayType: string;
		};
	};
	isVerified?: boolean;
	verifiedType?: string;
	isBlueVerified?: boolean;
	isProtected?: boolean;
	isDefaultProfile?: boolean;
	isDefaultProfileImage?: boolean;
	listedCount?: number;
	normalFollowersCount?: number;
	fastFollowersCount?: number;
	hasCustomTimelines?: boolean;
	isTranslator?: boolean;
	translatorType?: string;
	utcOffset?: number;
	timeZone?: string;
	showAllInlineMedia?: boolean;
	entities?: TwitterEntities;
	withheldInCountries?: string[];
	withheldScope?: string;
}

export interface UserApiResponse {
	success: boolean;
	data: {
		name: string;
		screen_name: string;
		profile_image_url_https: string;
		profile_banner_url?: string;
		description?: string;
		location?: string;
		url?: string;
		created_at: string;
		friends_count: number;
		followers_count: number;
		statuses_count: number;
		favourites_count: number;
		media_count?: number;
		is_blue_verified?: boolean;
		highlightedLabel?: {
			badge?: {
				url?: string;
				description: string;
				userLabelType: string;
				userLabelDisplayType: string;
			};
		};
		verified_type?: string;
		verified: boolean;
		protected: boolean;
		default_profile: boolean;
		default_profile_image: boolean;
		listed_count: number;
		normal_followers_count: number;
		fast_followers_count: number;
		has_custom_timelines: boolean;
		is_translator: boolean;
		translator_type: string;
		utc_offset: number;
		time_zone: string;
		show_all_inline_media: boolean;
		entities: TwitterEntities;
		withheld_in_countries: string[];
		withheld_scope: string;
		blocking: boolean;
		followed_by: boolean;
		following: boolean;
		follow_request_sent: boolean;
		notifications: boolean;
		id: number;
		id_str: string;
	};
}
