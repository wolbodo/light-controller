import Color from 'color'
import { fill, rgbSpots } from './Stage.svelte';
import { parameters, Parameters } from './stores';
import { derived, Readable, readable } from 'svelte/store';

export type Pattern = {
  name: string
  parameters: {
    [name: string]: 'color' | 'number'
  }
  get store(): Readable<any>
}

export const solid: Pattern = {
  name: 'Solid',
  parameters: {
    primary: 'color'
  },

  // Some store to subscribe to which updates itself with a scheduler like
  get store() {
    const run = ({ primary }: Parameters) => {
      fill(primary)
    }
    return readable('fill', set => {
      const unsubscribe = parameters.subscribe(run)
      return unsubscribe
    })
  }
}

export const wipe: Pattern = {
  name: 'Wipe',
  parameters: {
    primary: 'color',
    secondary: 'color'
  },
  
  get store() {
    let row = 0
    let state = true
    const run = ({ primary, secondary }: Parameters) => {
      console.log("Tick", row)
      const width = 4
      const color = state ? secondary : primary
      rgbSpots.update(spots => {
        spots.splice(row*width, width, ...(Array<Color>(4).fill(color)))
        return spots
      })
    }
    return readable('wipe-pattern', set => {
      let params
      const unsubscribe = parameters.subscribe(parameters => {
        params = parameters;
        run(parameters)
      })
      
      const interval = setInterval(() => {
        row = (row + 1) % 3
        if (!row) {
          state = !state
        }
        run(params)
      }, 500)
      return () => {
        unsubscribe()
        clearInterval(interval)
      }
    })
  }
}

