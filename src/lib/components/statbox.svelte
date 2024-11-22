<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

	import type { Icon } from 'lucide-svelte';

	export let label: string;
	export let value: number;
	export let icon: ComponentType<Icon>;
</script>

<TooltipProvider>
	<Tooltip>
		<TooltipTrigger>
			<div class="flex flex-col items-center">
				<svelte:component this={icon} class="mb-1 h-5 w-5 text-gray-400" />
				<div class="text-base font-semibold text-white">{value.toLocaleString()}</div>
				<div class="text-xs text-gray-400">{label}</div>
			</div>
		</TooltipTrigger>
		<TooltipContent>
			<p>{label}: {value.toLocaleString()}</p>
		</TooltipContent>
	</Tooltip>
</TooltipProvider>
