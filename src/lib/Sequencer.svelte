<script lang="ts">
  import { derived, get } from 'svelte/store';

	import Section from './Section.svelte';
  import { lights } from './stage';
  import SequenceStep from './Step.svelte';
  import { sequence, parameters, pattern, Step } from './stores'
  
  function add() {
    const step: Step = {
      pattern: $pattern,
      parameters: Object.fromEntries(
        Object.entries($parameters)
          .filter(([name,]) => name in $pattern.parameters)
      )
    }
    sequence.update(seq => [...seq, step])
  }

  $: {
    lights.fill($parameters.primary)
  }

</script>

<Section heading="Sequence">
  <button on:click={add}>Add</button>

  <section>
    {#each $sequence as step}
      <SequenceStep {...step} on:click={() => {
        pattern.set(step.pattern)
        parameters.update(params => ({
          ...params,
          ...step.parameters
        }))
      }} />
    {/each}
  </section>
</Section>


<style>
  section {
    display: flex;
  }
</style>
