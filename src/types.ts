// types.ts
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
}

export interface UserApiResponse {
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
	};
}
