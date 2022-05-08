<script lang="ts">
	import './app.css'

	import Parameters from './lib/Parameters.svelte'
	import Patterns from './lib/Patterns.svelte'
	import Sequencer from './lib/Sequencer.svelte'
	import Section from './lib/Section.svelte'
	import Stage from './lib/Stage.svelte'

	import { parameters, pattern, sequence } from './lib/stores'
	// import { onMount } from 'svelte';
	// import { lights } from './lib/stage'

	// $: {
	// 	if ($parameters || $pattern) {
	// 		lights.send()
	// 	}
	// }

	// onMount(() => {
	// 	console.log("Mount")
	// 	const timer = setInterval(() => lights.send(), 1000)

	// 	return () => clearInterval(timer)
	// })

</script>

<main>
	<section>
		<Patterns />
		<Parameters />
		<Stage />
	</section>
	
	<Sequencer />
	<Section heading='Debug'>
		<pre>pattern: {JSON.stringify($pattern, null, 2)}</pre>
		<pre>parameters: {JSON.stringify($parameters, null, 2)}</pre>
		<pre>sequence: {JSON.stringify($sequence, null, 2)}</pre>
	</Section>
</main>

<style>
	main {
		padding: .5em;
		max-width: 240px;
		margin: 0 auto;

		display: flex;
		flex-flow: column;
	}
	main > section {
		display: flex;
		margin-bottom: .5rem;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>