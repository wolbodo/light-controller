import { invoke } from '@tauri-apps/api/tauri'
import Color from 'color'
import convert from 'color-convert'

async function wait(ms = 100) {
    await new Promise((resolve, reject) => setTimeout(resolve, ms))
}


interface Fixture {
  get payload(): number[]
  set color(value)
}

class RGBPar implements Fixture {
  r: number
  g: number
  b: number

  constructor() {
    this.r = 0
    this.g = 0
    this.b = 0
  }
  get payload() {
    return [0, 0, this.r, this.g, this.b]
  }
  set color(color) {
    const [r, g, b] = Color(color).array()
    this.r = r;
    this.g = g
    this.b = b
  }
}
class Spot {
  value: number

  constructor() {
    this.value = 0
  }
  get payload() {
    return [this.value]
  }
  set color(value) {
    this.value = value
  }
}


const factor = 100/255
class Lights {
  lights: Fixture[]
  allRGB: RGBPar[]
  dimmer: Fixture[]
  
  constructor() {
    this.lights = []

      const [a1, a2, a3, a4] = [new RGBPar(), new RGBPar(), new RGBPar(), new RGBPar()]
      const [b1, b2, b3, b4] = [new RGBPar(), new RGBPar(), new RGBPar(), new RGBPar()]
      const [c1, c2, c3, c4] = [new RGBPar(), new RGBPar(), new RGBPar(), new RGBPar()]
      const rowA = [a1, a2, a3, a4]
      const rowB = [b1, b2, b3, b4]
      const rowC = [c1, c2, c3, c4]
      this.allRGB = [...rowA, ...rowB, ...rowC]
      this.add(...this.allRGB)

      this.dimmer = [new Spot(),new Spot(),new Spot(),new Spot()]

      this.add(...this.dimmer)

  }
  add(...lights: Fixture[]) {
    this.lights.push(...lights)
  }
  async send() {
		const response = await invoke('send_sacn', {
			data: [...this.lights.flatMap(f => f.payload)]
		})
  }

  off() {
    for (let light of this.lights) {
      light.color = [0,0,0]
    }
  }

  fill(color) {
    console.log("FIll", color)
    this.allRGB.map(par => par.color = color) 
  }
}



  // export const randomColor = (value=100) => convert.hsv.rgb([Math.random()*255|0, 100, value])

  // export const setRandom = (color) => {
  //   const light = all[Math.random() * all.length |0]
  //   light.color = color
  //   return light
  // }

  // export const wipeLR = async (color, speed, reverse=false) =>  {
  //   const columns = [
  //     [a1, b1, c1], 
  //     [a2, b2, c2], 
  //     [a3, b3, c3], 
  //     [a4, b4, c4], 
  //   ]
  //   if (reverse) columns.reverse()

  //   for (let set of columns) {
  //     for (let light of set) {
  //       light.color = color
  //     }

  //     lights.send()
  //     await wait(speed)
  //   }
  // }
  export const lights = new Lights()
  
    // // while (true) {
    //   console.log("Loop", i++)
    //   // all([100, 0,0])
    //   // a1.color = [100, 0, 0]
    //   // a2.color = [0, 100, 0]
    //   // a3.color = [0, 0, 100]
    //   // a4.color = [100, 0, 100]
    //   // s1.value = s2.value = s3.value = s4.value = 100
    //   h= h+10 % 255
    //   const color = convert.hsv.rgb([h, 255, 5])
    //   wipeLR(color, Math.random()*waiter + 100, Math.random() < .5)

    //   setAll(color)
    //   const otherColor = randomColor()
    //   for (let i=0; i<5; i++) {
    //     const light = setRandom(otherColor)
        
    //     lights.send()
    //     await wait(Math.random()*waiter + 100)
    //     light.color = color
      // }
        
      // lights.send()
      // await wait(waiter)

      // lights.off()
      // lights.send()
      // await wait(waiter)

      // for (let spot of [s1, s2, s3, s4]) {
      //   s1.value = s2.value = s3.value = s4.value = 25
      //   spot.value = 100
          
      //   lights.send()
      //   await wait(Math.random()*500 + 100)
      // }
      

      // c1.color = [100, 0, 0]
      // c2.color = [0, 100, 0]
      // c3.color = [0, 0, 100]
      // c4.color = [100, 0, 100]
      // s1.value = s2.value = s3.value = s4.value = 50
        
      // lights.send()
      // await wait(waiter)
  
      // c4.color = [255, 0, 0]
      // c3.color = [0, 255, 0]
      // c2.color = [0, 0, 255]
      // c1.color = [255, 0, 255]
      // s1.value = s2.value = s3.value = s4.value = 0

      // lights.send()
  
      // await wait(waiter)

      // b4.color = [255, 0, 0]
      // b3.color = [0, 255, 0]
      // b2.color = [0, 0, 255]
      // b1.color = [255, 0, 255]
      // s1.value = s2.value = s3.value = s4.value = 50
        
      // lights.send()
  
      // await wait(waiter)

      // a4.color = [255, 0, 0]
      // a3.color = [0, 255, 0]
      // a2.color = [0, 0, 255]
      // a1.color = [255, 0, 255]
      // s1.value = s2.value = s3.value = s4.value = 100
        
      // lights.send()
  
      // await wait(waiter)

      // lights.off()
      // lights.send()
  
      // await wait(waiter)

    // }


    // const LIGHTS = 12
    // let on = false

    // for (let t=0; t<1000000; t++) {
    //     // const payload = Object.fromEntries(
    //     //     Array(4*4).fill(0)
    //     //         .flatMap((_, i) => convert.hsv.rgb(i*5 + t, (Math.sin(t/200+10*i)+1) * 64 + 128, 255))
    //     //         .map((v, i) => [i+1, v * (100 /255)]
    //     // ))
    //     const payload = Object.fromEntries(
    //         Array(LIGHTS).fill(0).flatMap((_, i) => {
    //           const index = (i + (t / 10 |0)) % 3
    //           return [
    //             0, 0,
    //               (index === 0 ? (t/2) % 50 : t/10 % 5) |0,
    //               (index === 1 ? (t/3) % 50 : t/12 % 5) |0,
    //               (index === 2 ? (t/4) % 50 : t/14 % 5) |0
    //           ]
    //         }).map((v, i) => [i, v])
    //     )
    //     console.log('send', payload)

    //     await sACNServer.send({
    //       payload,
    //       sourceName: "Bridge", // optional. LED lights will use this as the name of the source lighting console.
    //       priority: 100, // optional. value between 0-200, in case there are other consoles broadcasting to the same universe
    //     });
    //     await wait(50)
        
    // }

