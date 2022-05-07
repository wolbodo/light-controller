<script lang="ts">
import { onMount } from 'svelte';

  import { derived, get } from 'svelte/store';

	import Section from './Section.svelte';
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

  function tick() {
    // console.log('tick', $pattern, $parameters)
    $pattern.tick($parameters)
  }

  onMount(() => {
    const timer = setInterval(tick, 400)
    return () => clearInterval(timer)
  })

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
