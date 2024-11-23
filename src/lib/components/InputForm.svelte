<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import LoadingSpinner from './LoadingSpinner.svelte';

	export let onSourceSubmit: (sourceCode: string) => void;
	export let onUsernameSubmit: (username: string) => Promise<void>;

	let currentMode = 'source';
	let sourceCode = '';
	let username = '';
	let isLoading = false;

	function handleSourceSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSourceSubmit(sourceCode);
	}

	async function handleUsernameSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (isLoading) return;

		isLoading = true;
		try {
			await onUsernameSubmit(username);
		} finally {
			isLoading = false;
		}
	}
</script>

<Tabs bind:value={currentMode}>
	<TabsList class="grid w-full grid-cols-2">
		<TabsTrigger value="source">Source Code</TabsTrigger>
		<TabsTrigger value="username">Username(Verified)</TabsTrigger>
	</TabsList>

	<TabsContent value="source">
		<form on:submit={handleSourceSubmit} class="space-y-4">
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
					disabled={isLoading}
				/>
			</div>
			<Button type="submit" class="w-full" disabled={!username || isLoading}>
				{#if isLoading}
					<LoadingSpinner size="w-4 h-4" className="mr-2" />
					Fetching...
				{:else}
					Fetch Stats
				{/if}
			</Button>
		</form>
	</TabsContent>
</Tabs>

<Alert variant="destructive" class="mt-4 border-red-900/50 bg-red-900/20">
	<AlertDescription class="text-primary">
		We do not store any data from the source code or username you provide. All processing is done
		client-side.
	</AlertDescription>
</Alert>
