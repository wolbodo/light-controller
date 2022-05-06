<script lang=ts>
  export let heading: string
</script>

<section>
  {#if heading}
    <h1>{heading}</h1>
  {/if}
  <slot />
</section>

<style>
  section {
    border: thin solid #fdae94;
		padding: .5em;
	}
	section + :global(section) {
    margin-top: .5rem;
	}

	h1 {
		color: #ff3e00;
		font-weight: bold;
		text-transform: uppercase;
		font-size: 2em;
		margin-top: 0;
	}
</style>
