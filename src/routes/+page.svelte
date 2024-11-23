<script lang="ts">
	import { Card, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import StatBox from '$lib/components/statbox.svelte';
	import ProfileInfo from '$lib/components/ProfileInfo.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import { TwitterDataProcessor } from '$lib/utils/twitter';
	import type { TwitterStats } from '../types.ts';
	import { MessageSquare, UserPlus, Users, Heart } from 'lucide-svelte';

	let stats: TwitterStats | null = null;

	async function handleSourceSubmit(sourceCode: string) {
		try {
			if (!sourceCode) {
				throw new Error('Please provide HTML source code');
			}

			const parser = new DOMParser();
			const doc = parser.parseFromString(sourceCode, 'text/html');
			const scriptTags = doc.querySelectorAll('script');

			for (const script of scriptTags) {
				const content = script.textContent;
				if (content?.includes('window.__INITIAL_STATE__')) {
					const match = content.match(
						/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});?(?:\s*window|\s*$)/
					);

					if (match) {
						const initialState = TwitterDataProcessor.safeJSONParse(match[1]);
						stats = TwitterDataProcessor.extractProfileData(initialState);
						return;
					}
				}
			}
			throw new Error('Could not find or parse initial state');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'An error occurred');
			console.error(error);
		}
	}
	async function handleUsernameSubmit(username: string) {
		try {
			if (!username) {
				throw new Error('Username is required');
			}

			const response = await fetch(`/api/twitter/verified-only/${username}`);
			if (!response.ok) {
				throw new Error(
					response.status === 404 ? 'User not found or not verified' : 'Failed to fetch user data'
				);
			}

			const data = await response.json();
			if (!data?.data) {
				throw new Error('Either user is not verified or does not exist');
			}

			stats = TwitterDataProcessor.mapUserToStats(data.data);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'An error occurred');
			console.error(error);
			throw error; // Rethrow to handle loading state in the form
		}
	}

	function resetStats(): void {
		stats = null;
	}
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
				<div class="space-y-6">
					<div class="relative mb-16">
						<img
							src={stats.bannerUrl ?? ''}
							alt="Profile Banner"
							class="h-48 w-full rounded-t-lg object-cover"
						/>
						{#if stats.verifiedType === 'Business'}
							<Avatar
								class="absolute bottom-0 left-4 h-24 w-24 translate-y-1/2 transform rounded-lg border-4 border-secondary"
							>
								<AvatarImage src={stats.avatarUrl} alt={stats.name} />
								<AvatarFallback>{stats.name.charAt(0)}</AvatarFallback>
							</Avatar>
						{:else}
							<Avatar
								class="absolute bottom-0 left-4 h-24 w-24 translate-y-1/2 transform rounded-full border-4 border-secondary"
							>
								<AvatarImage src={stats.avatarUrl} alt={stats.name} />
								<AvatarFallback>{stats.name.charAt(0)}</AvatarFallback>
							</Avatar>
						{/if}
					</div>

					<ProfileInfo {stats} />

					<div class="grid grid-cols-4 gap-4 px-4 text-center">
						<StatBox label="Following" value={stats.following} icon={UserPlus} />
						<StatBox label="Followers" value={stats.followers} icon={Users} />
						<StatBox label="Tweets" value={stats.tweets} icon={MessageSquare} />
						<StatBox label="Likes" value={stats.likes} icon={Heart} />
					</div>
				</div>
			{:else}
				<InputForm onSourceSubmit={handleSourceSubmit} onUsernameSubmit={handleUsernameSubmit} />
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
