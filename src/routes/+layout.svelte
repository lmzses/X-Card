<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Button } from '$lib/components/ui/button';
	import { dev } from '$app/environment';

	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	let { children } = $props();
</script>

<Toaster />
<div class="flex h-screen flex-col bg-background">
	<main class="">
		{@render children?.()}
	</main>
	<footer class="w-full px-4 py-4">
		<div class="mx-auto max-w-md text-center text-sm text-gray-400">
			<p class="mt-1">
				X Profile Card Generator. Built by <Button
					variant="link"
					href="https://x.com/moimojk"
					class="p-0">@moimojk</Button
				>
			</p>
			<p>
				Source Code in <Button variant="link" href="https://github.com/lmzses/x-card" class="p-0"
					>Github</Button
				>
			</p>
		</div>
	</footer>
</div>
