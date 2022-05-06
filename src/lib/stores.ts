import Color from 'color'
import { writable } from 'svelte/store'

import { solid } from './patterns'
import type { Pattern } from './patterns'
import * as patterns from './patterns'

const pickRandom = arr => arr[Math.random()*arr.length |0]
const randomColor = () => Color([Math.random()*255|0,Math.random()*255|0,Math.random()*255|0])

export type Parameters = {
  [name: string]: 'color' | 'number'
}
export type Step = {
  pattern?: Pattern,
  parameters?: Parameters
}

export const pattern = writable<Pattern>(solid)
export const parameters = writable<Parameters>({})
export const sequence = writable<Step[]>(
  Array(5)
    .fill(0)
    .map((): Step => {
      const pattern = pickRandom(Object.values(patterns))
      return {
        pattern,
        parameters: Object.fromEntries(
          Object.entries(pattern.parameters)
            .map(([name, type]) => (
              [name, randomColor()]
            ))
        )
      }
    })
)