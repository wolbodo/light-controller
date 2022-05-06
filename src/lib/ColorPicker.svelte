<script lang='ts'>
  import convert from 'color-convert'
  import Color from 'color'

  export let color = 'rgb(12,0,6)'

  $: _color = Color(color)
</script>

<input
  style:--color={_color}
  value={_color.hex()}
  type='color'
  on:change={e => color = Color(e.target.value)}
/>

<style>
  input {
    background: var(--color);

    width: 3rem;
    height: 3rem;
  }
</style>