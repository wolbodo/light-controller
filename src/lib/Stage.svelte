<script lang="ts" context='module'>
  import Color from 'color'
  import { invoke } from '@tauri-apps/api/tauri'
  import { writable } from 'svelte/store';
  
  export const RGB_SPOTS = 12
  export const SPOTS = 4

  export type Spot = number;
  
  export const rgbSpots = writable<Color[]>(Array(RGB_SPOTS).fill(Color()))
  export const spots = writable<Spot[]>(Array(SPOTS).fill(0))

  export const fill = (color) => {
    rgbSpots.update(spots => spots.map(() => color))
  }
</script>

<script lang='ts'>
  let count = 0

  function debounce(func, timeout = 100) {
    let timer;
    let lastargs;

    const rundelayed = () => {
      timer = undefined;

      if (lastargs) {
        func.apply(this, lastargs)
        timer = setTimeout(rundelayed, timeout)
        lastargs = undefined
      }
    }
    return (...args) => {

      if (!timer) {
        func.apply(this, args);
        timer = setTimeout(rundelayed, timeout);
      } else {
        // Called with timer running
        lastargs = args
      }
    };
  }

  const sendSacn = debounce((data) => {
    console.log("Sending", data)
		invoke('send_sacn', {
			data: data.map(v => v|0)
		})
      .then(() => count++)
      .catch(e => console.error('error', e))
  })
  $: {
    // Should be calling send on max hz
    sendSacn([
      ...$rgbSpots.flatMap(color => [0, 0, ...color.rgb().array()]),
      ...$spots
    ])
  }
</script>

<svg viewBox="0 0 8 12">
  <text y=1 fill=white>{count%1000}</text>
  {#each $rgbSpots as color, i}
    <circle r=1 cx={i%4 * 2 + 1} cy={12 - ((i/4|0) * 2 + 1)} fill="{color}" />
  {/each}
</svg>

<style>
  text {
    font-size: 1px;
  }
  svg {
    background: gray;
    width: 8rem;
    height: 12rem;
  }
</style>