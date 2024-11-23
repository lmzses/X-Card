import type { TwitterStats } from '../../types';

// utils/twitter.ts
export class TwitterDataProcessor {
	static safeJSONParse(jsonString: string): any {
		const cleanupStrategies = [
			(str: string) => str.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
			(str: string) => str.replace(/,\s*}/g, '}'),
			(str: string) => str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
		];

		try {
			return JSON.parse(jsonString);
		} catch (initialError) {
			for (const cleanupStrategy of cleanupStrategies) {
				try {
					return JSON.parse(cleanupStrategy(jsonString));
				} catch {
					continue;
				}
			}
			throw new Error('Failed to parse JSON after multiple cleanup attempts');
		}
	}

	static extractProfileData(initialState: any): TwitterStats {
		const users = initialState?.entities?.users?.entities;
		if (!users) throw new Error('No user entities found in the source');

		const user = Object.values(users)[0] as any;
		if (!user) throw new Error('Could not retrieve user information');

		return TwitterDataProcessor.mapUserToStats(user);
	}

	static mapUserToStats(user: any): TwitterStats {
		return {
			name: user?.name ?? 'Unknown',
			username: user.screen_name ?? 'unknown',
			avatarUrl: user.profile_image_url_https?.replace('normal', '400x400'),
			bannerUrl: user.profile_banner_url,
			bio: user.description ?? '',
			location: user.location ?? '',
			website: user.url ?? '',
			joinDate: user.created_at
				? `Joined ${new Date(user.created_at).toLocaleDateString('en-US', {
						month: 'long',
						year: 'numeric'
					})}`
				: undefined,
			following: user.friends_count ?? 0,
			followers: user.followers_count ?? 0,
			tweets: user.statuses_count ?? 0,
			likes: user.favourites_count ?? 0,
			bookmarks: 0,
			mediaCount: user.media_count ?? 0,
			isVerified: user.is_blue_verified ?? false,
			verifiedType: user.verified_type ?? ''
		};
	}
}
