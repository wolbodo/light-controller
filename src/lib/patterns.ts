import type Color from 'color'
import { fill, rgbSpots, RGB_SPOTS } from './Stage.svelte';
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
      let time = 0
      const interval = setInterval(() => {
        if (time%5 === 0) {
          row = (row + 1) % 3
          if (!row) {
            state = !state
          }
        }
        
        rgbSpots.update(spots => {
          return spots.map(color => color.darken(0.4))
        })
        time ++
        run(params)
      }, 100)
      return () => {
        unsubscribe()
        clearInterval(interval)
      }
    })
  }
}

export const random: Pattern = {
  name: 'Random',
  parameters: {
    primary: 'color',
    secondary: 'color'
  },
  
  get store() {
    const random = () => ({
      index: Math.random() * RGB_SPOTS |0,
      speed: Math.random()/5 + 0.01,
      factor: 0,
      on: true
    })
    const POINTS = 6
    let points = Array(POINTS).fill(null).map(() => random())
    let refreshIndex = 0

    const run = ({ primary, secondary }: Parameters) => {
      rgbSpots.update(spots => {
        spots = spots.map(() => primary)
        points.forEach(({ index, factor }) => spots[index] = primary.mix(secondary, factor))
        return spots
      })
    }
    return readable('random-flash', set => {
      let params
      const unsubscribe = parameters.subscribe(parameters => {
        params = parameters;
        run(parameters)
      })
      const interval = setInterval(() => {
        points.forEach((point, index) => {
          if (point.on) {
            point.factor += point.speed
            if (point.factor >= 1) {
              point.factor = 1
              point.on = false
            }
          } else {
            point.factor -= point.speed
            if (point.factor <= 0) {
              point.factor = 0
              point.on = true

              if (index === refreshIndex) {
                points[index] = random()
                refreshIndex = (refreshIndex+1) % POINTS
              }
            }

          }
        })
        rgbSpots.update(spots => {
          return spots.map(color => color.darken(0.4))
        })
        run(params)
      }, 20)
      return () => {
        unsubscribe()
        clearInterval(interval)
      }
    })
  }
}

