// src/routes/api/twitter/[username]/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

// Types and Interfaces
interface TwitterUser {
	id_str: string;
	name: string;
	screen_name: string;
	description?: string;
	followers_count: number;
	friends_count: number;
	profile_image_url_https?: string;
	verified?: boolean;
	[key: string]: unknown;
}

interface TwitterResponse {
	success: boolean;
	data?: TwitterUser;
	error?: {
		message: string;
		code: ErrorCode;
	};
}

interface TwitterData {
	props: {
		pageProps: {
			timeline: {
				entries: Array<{
					content: {
						tweet: {
							user: TwitterUser;
						};
					};
				}>;
			};
		};
	};
}

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// Custom error class for Twitter-related errors
class TwitterError extends Error {
	constructor(
		message: string,
		public status: number,
		public code: ErrorCode
	) {
		super(message);
		Object.setPrototypeOf(this, TwitterError.prototype);
	}
}

// Constants
const TWITTER_API_BASE = 'https://syndication.twitter.com/srv/timeline-profile/screen-name';
const ERROR_CODES = {
	FETCH_FAILED: 'FETCH_FAILED',
	INVALID_USERNAME: 'INVALID_USERNAME',
	PARSE_ERROR: 'PARSE_ERROR',
	DATA_NOT_FOUND: 'DATA_NOT_FOUND',
	USER_NOT_FOUND: 'USER_NOT_FOUND'
} as const;

// Validation functions
function validateUsername(username: string): void {
	if (!username || username.length > 15 || !/^[A-Za-z0-9_]+$/.test(username)) {
		throw new TwitterError('Invalid Twitter username format', 400, ERROR_CODES.INVALID_USERNAME);
	}
}

// Data fetching function
async function fetchTwitterProfile(username: string, fetch: typeof global.fetch): Promise<string> {
	const response = await fetch(`${TWITTER_API_BASE}/${username}`);

	if (!response.ok) {
		throw new TwitterError(
			'Failed to fetch Twitter profile',
			response.status,
			ERROR_CODES.FETCH_FAILED
		);
	}

	return response.text();
}

// Data parsing function
function parseTwitterData(html: string): TwitterUser {
	const $ = cheerio.load(html);
	const scriptContent = $('script#__NEXT_DATA__').text();

	if (!scriptContent) {
		throw new TwitterError('Twitter data not found', 404, ERROR_CODES.DATA_NOT_FOUND);
	}

	try {
		const data = JSON.parse(scriptContent) as TwitterData;
		const user = data?.props?.pageProps?.timeline?.entries?.[0]?.content?.tweet?.user;

		if (!user) {
			throw new TwitterError('User data not found', 404, ERROR_CODES.USER_NOT_FOUND);
		}

		return user;
	} catch (error) {
		throw new TwitterError('Failed to parse Twitter data', 500, ERROR_CODES.PARSE_ERROR);
	}
}

// Helper function to parse stat counts (e.g., "1.5K" to 1500)
function parseStatCount(str: string | null | undefined): number {
	if (!str) return 0;
	str = str.trim();

	const num = parseFloat(str.replace(/[^0-9.]/g, ''));
	const multiplier = str.slice(-1).toLowerCase();

	switch (multiplier) {
		case 'k':
			return num * 1000;
		case 'm':
			return num * 1000000;
		default:
			return num;
	}
}

// Response formatter
function formatErrorResponse(error: TwitterError | Error): Response {
	const status = error instanceof TwitterError ? error.status : 500;
	const code = error instanceof TwitterError ? error.code : 'UNKNOWN_ERROR';

	return json<TwitterResponse>(
		{
			success: false,
			error: {
				message: error.message,
				code
			}
		},
		{ status }
	);
}

// Main endpoint handler
export const GET: RequestHandler = async ({ params, fetch }) => {
	const { username } = params;

	try {
		// Validate input
		validateUsername(username);

		// Fetch and parse data
		const html = await fetchTwitterProfile(username, fetch);
		const userData = await parseTwitterData(html);

		// Return successful response
		return json<TwitterResponse>({
			success: true,
			data: userData
		});
	} catch (error) {
		console.error(`Twitter API Error (${username}):`, {
			message: error instanceof Error ? error.message : 'Unknown error',
			code: error instanceof TwitterError ? error.code : 'UNKNOWN_ERROR',
			status: error instanceof TwitterError ? error.status : 500,
			stack: error instanceof Error ? error.stack : undefined
		});

		// Return formatted error response
		return formatErrorResponse(error as Error);
	}
};
