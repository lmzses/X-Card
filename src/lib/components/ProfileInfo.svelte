<script lang="ts">
	import { MapPin, Link, Calendar } from 'lucide-svelte';
	import type { TwitterStats } from '../../types';

	export let stats: TwitterStats;
	$: websiteHostname = stats?.website ? new URL(stats.website).hostname.replace(/^www\./, '') : '';
</script>

<div class="mt-16 px-4">
	<div class="flex items-center">
		<h3 class="flex items-center text-2xl font-bold">
			<span>{stats.name}</span>
			{#if stats.isVerified}
				{#if stats.verifiedType === 'Government'}
					<img src="assets/Twitter_Verified_Badge_Gray.svg" class="ml-1 h-5 w-5" />
				{:else if stats.verifiedType === 'Business'}
					<img src="assets/Twitter_Verified_Badge_Gold.svg" class="ml-1 h-5 w-5" />
				{:else}
					<img src="assets/Twitter_Verified_Badge.svg" class="ml-1 h-5 w-5" />
				{/if}
			{/if}
			{#if !stats.isVerified && stats.verifiedType === 'Business'}
				<img src="assets/Twitter_Verified_Badge_Gold.svg" class="ml-1 h-5 w-5" />
			{/if}
		</h3>
	</div>
	<p class="text-muted-foreground">@{stats.username}</p>
	<p class="mt-2">{stats.bio}</p>

	<div class="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
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
