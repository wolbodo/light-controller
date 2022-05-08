<script lang='ts'>
  import type { Parameters } from './stores'
  import type { Pattern } from './patterns'

  export let pattern: Pattern = null
  export let parameters: Parameters = null

  export let current = false
</script>

<article on:click class:current>
  {pattern.name}

  <section class='parameters'>
    {#each Object.values(parameters) as color}
      <span style:--color={color} />
    {/each}
  </section>
</article>

<style>
  article {
    display: flex;
    flex-flow: column;
    height: 5rem;
    width: 5rem;
    border: thin solid black;

    margin: .5rem;
    padding: .5rem;
  }

  .current {
    border-color: red;
  }

  .parameters {
    display: flex;
    flex: 1;
  }
  .parameters > span {
    background: var(--color);
    flex: 1;

  }
</style>