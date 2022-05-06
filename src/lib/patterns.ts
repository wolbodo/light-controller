export type Color = string

export type Pattern = {
  name: string
  parameters: {
    [name: string]: 'color' | 'number'
  }
}

export const solid: Pattern = {
  name: 'Solid',
  parameters: {
    primary: 'color'
  }
}

export const wipe: Pattern = {
  name: 'Wipe',
  parameters: {
    primary: 'color',
    secondary: 'color'
  }
}

