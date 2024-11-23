<script lang="ts">
	import { MapPin, Link, Calendar } from 'lucide-svelte';
	import type { TwitterStats } from '../../types';

	export let stats: TwitterStats;
	$: websiteHostname = stats?.website ? new URL(stats.website).hostname.replace(/^www\./, '') : '';
</script>

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
