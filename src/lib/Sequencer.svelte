<script lang="ts">
  import { onMount } from 'svelte';

	import Section from './Section.svelte';
  import SequenceStep from './Step.svelte';
  import { sequence, parameters, pattern, Step } from './stores'

  let currentStep = $sequence[0]

  $: if (!currentStep && $sequence.length) {
    currentStep = $sequence[0]
  }
  
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
  $: currentStore = $pattern.store

  $: {
    console.log($currentStore)
  }

</script>

<Section heading="Sequence">
  <button on:click={add}>Add</button>

  <section>
    {#each $sequence as step}
      <SequenceStep
        {...step}
        current={step === currentStep}
        on:click={() => {
          currentStep = step
          pattern.set(step.pattern)
          parameters.update(params => ({
            ...params,
            ...step.parameters
          }))
        }}
      />
    {/each}
  </section>
</Section>


<style>
  section {
    display: flex;
  }
</style>
