import { lights } from './stage';

export type Color = string

export type Pattern = {
  name: string
  parameters: {
    [name: string]: 'color' | 'number'
  }
  tick(Parameters)
}

export const solid: Pattern = {
  name: 'Solid',
  parameters: {
    primary: 'color'
  },

  tick({ primary }) {
    lights.fill(primary)
  }
}

export const wipe: Pattern & {
  state: number
} = {
  name: 'Wipe',
  parameters: {
    primary: 'color',
    secondary: 'color'
  },
  state: 0,

  tick({ primary, secondary }) {
    console.log("Tick", this.state)
    this.state = (this.state + 1) % 4
    for (let row=0; row<4; row++) {
      const color = this.state > row ? secondary : primary
      const index =row*4
      const par = lights.allRGB.slice(index, index+4)
      console.log(par)
      par
        .forEach(par => {
          par.color = color
        })

    }
    lights.send()
  }
}

