<script lang="ts">
	import Section from './Section.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import { parameters, pattern } from './stores'
</script>

<Section heading="Parameters">
	{#each Object.entries($pattern.parameters) as [name, type]}
		{#if type === 'color'}
			<ColorPicker bind:color={$parameters[name]} />
		{:else}
			<p>Unsupported type {type}</p>
		{/if}
	{/each}
</Section>

