<script lang="ts">
	import { Card, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import {
		MessageCircle,
		Heart,
		UserPlus,
		Users,
		Link,
		Calendar,
		MapPin,
		BarChart2,
		Bookmark,
		ImageIcon,
		MessageSquare
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import StatBox from '$lib/components/statbox.svelte';

	// Improved type definition with optional properties and defaults
	interface TwitterStats {
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
	}

	// Enum for input modes

	// Safer initial state
	let stats: TwitterStats | null = null;
	let sourceCode = '';
	let username = '';
	let currentMode = 'source';

	// Improved error handling function
	function displayError(message: string): void {
		toast.error(message);
		console.error(message);
	}

	// Reset function with clear responsibilities
	function resetStats(): void {
		stats = null;
		sourceCode = '';
		username = '';
		currentMode = 'source';
	}

	// Safer JSON parsing with multiple fallback strategies
	function safeJSONParse(jsonString: string): any {
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
					const cleanedJson = cleanupStrategy(jsonString);
					return JSON.parse(cleanedJson);
				} catch (cleanupError) {
					continue;
				}
			}
			displayError('Failed to parse JSON after multiple cleanup attempts');
			return null;
		}
	}

	// Centralized data extraction with robust error checking
	function extractProfileData(initialState: any): TwitterStats | null {
		try {
			const users = initialState?.entities?.users?.entities;
			if (!users) {
				displayError('No user entities found in the source');
				return null;
			}

			const user = Object.values(users)[0] as any;
			if (!user) {
				displayError('Could not retrieve user information');
				return null;
			}

			return {
				name: user?.name ?? 'Unknown',
				username: user.screen_name ?? 'unknown',
				avatarUrl: user.profile_image_url_https
					? user.profile_image_url_https.replace('normal', '400x400')
					: undefined,
				bannerUrl: user.profile_banner_url,
				bio: user.description ?? '',
				location: user.location ?? '',
				website: user.url ?? '',
				joinDate: `Joined ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
				following: user.friends_count ?? 0,
				followers: user.followers_count ?? 0,
				tweets: user.statuses_count ?? 0,
				likes: user.favourites_count ?? 0,
				bookmarks: 0,
				mediaCount: user.media_count ?? 0
			};
		} catch (error) {
			displayError('Error processing user data');
			return null;
		}
	}

	function scrapeSource(e: SubmitEvent): void {
		e.preventDefault();

		if (!sourceCode) {
			return displayError('Please provide HTML source code');
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(sourceCode, 'text/html');

		const scriptTags = doc.querySelectorAll('script');
		let initialState = null;

		for (const script of scriptTags) {
			const content = script.textContent;
			if (content?.includes('window.__INITIAL_STATE__')) {
				const match = content.match(
					/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});?(?:\s*window|\s*$)/
				);

				if (match) {
					initialState = safeJSONParse(match[1]);
					if (initialState) {
						stats = extractProfileData(initialState);
						return;
					}
				}
			}
		}

		displayError('Could not find or parse initial state');
	}

	function handleUsernameSubmit(e: SubmitEvent): void {
		e.preventDefault();
		// Placeholder for future API integration
		displayError('Username lookup not implemented yet');
	}

	// Reactive statement for website hostname
	$: websiteHostname = stats?.website ? new URL(stats.website).hostname.replace(/^www\./, '') : '';
</script>

<svelte:head>
	<title>X Profile Card Generator</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-4">
	<Card class="mx-auto min-h-[25rem] w-full max-w-lg">
		<CardHeader class="items-center text-center">
			<img src="x-logo.svg" class="h-6 w-6" alt="X Logo" />
		</CardHeader>

		<CardContent>
			{#if stats}
				<!-- Profile display remains largely unchanged -->
				<div class="space-y-6">
					<div class="relative mb-16">
						<img
							src={stats.bannerUrl ?? ''}
							alt="Profile Banner"
							class="h-48 w-full rounded-t-lg object-cover"
						/>
						<Avatar
							class="absolute bottom-0 left-4 h-24 w-24 translate-y-1/2 transform border-4 border-secondary"
						>
							<AvatarImage src={stats.avatarUrl} alt={stats.name} />
							<AvatarFallback>{stats.name.charAt(0)}</AvatarFallback>
						</Avatar>
					</div>

					<div class="mt-16 px-4">
						<h3 class="text-2xl font-bold">{stats.name}</h3>
						<p class="text-muted-foreground">@{stats.username}</p>
						<p class="mt-2">{stats.bio}</p>

						<div class="mt-2 flex flex-wrap gap-4 text-muted-foreground">
							{#if stats.location}
								<div class="flex items-center">
									<MapPin class="mr-1 h-4 w-4" />
									<span>{stats.location}</span>
								</div>
							{/if}

							{#if stats.website}
								<div class="flex items-center">
									<Link class="mr-1 h-4 w-4" />
									<a
										href={stats.website}
										target="_blank"
										rel="noopener noreferrer"
										class="text-primary hover:underline"
									>
										{websiteHostname}
									</a>
								</div>
							{/if}

							{#if stats.joinDate}
								<div class="flex items-center">
									<Calendar class="mr-1 h-4 w-4" />
									<span>{stats.joinDate}</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-4 gap-4 px-4 text-center">
						<StatBox label="Following" value={stats.following} icon={UserPlus} />
						<StatBox label="Followers" value={stats.followers} icon={Users} />
						<StatBox label="Tweets" value={stats.tweets} icon={MessageSquare} />
						<StatBox label="Likes" value={stats.likes} icon={Heart} />
					</div>
				</div>
			{:else}
				<Tabs bind:value={currentMode}>
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="source">Source Code</TabsTrigger>
						<TabsTrigger value="username" disabled>Username</TabsTrigger>
					</TabsList>

					<TabsContent value="source">
						<form on:submit={scrapeSource} class="space-y-4">
							<Textarea
								placeholder="Paste your Twitter/X profile source code here..."
								bind:value={sourceCode}
								rows={10}
							/>
							<Button type="submit" class="w-full">View Stats</Button>
						</form>
					</TabsContent>

					<TabsContent value="username">
						<form on:submit={handleUsernameSubmit} class="m-auto space-y-4">
							<div class="space-y-2">
								<Label for="username">Twitter/X Username</Label>
								<Input
									id="username"
									placeholder="Enter username (without @)"
									bind:value={username}
								/>
							</div>
							<Button type="submit" class="w-full" disabled>Fetch Stats</Button>
						</form>
					</TabsContent>
				</Tabs>
				<Alert variant="destructive" class="mt-4 border-red-900/50 bg-red-900/20">
					<AlertDescription class="text-primary">
						We do not store any data from the source code or username you provide. All processing is
						done client-side.
					</AlertDescription>
				</Alert>
			{/if}
		</CardContent>

		{#if stats}
			<CardFooter class="justify-center">
				<button type="button" on:click={resetStats} class={buttonVariants({ variant: 'outline' })}>
					View Another Profile
				</button>
			</CardFooter>
		{/if}
	</Card>
</div>
