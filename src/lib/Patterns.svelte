<script lang="ts">
	import Section from './Section.svelte';
  import { pattern } from './stores'
  import * as patterns from './patterns'

  const patternEntries = Object.entries(patterns)
  let [currentName, currentPattern] = patternEntries.find(([name, value]) => value === $pattern)

  $: {
    let [name,] = patternEntries.find(([name, value]) => value === $pattern)
    currentName = name
  }
</script>

<Section heading="Patterns">
  <select bind:value={currentName} on:change={() => $pattern = patterns[currentName]}>
    {#each patternEntries as [name, pattern]}
      <option value={name}>{pattern.name}</option>
    {/each}
  </select>
</Section>

