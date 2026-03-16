/**
 * GPUSim — full GPU Gray-Scott pipeline.
 *
 * Usage:
 *   const sim = new GPUSim(renderer, 256)
 *   sim.reset(params)
 *   // each frame:
 *   sim.step(params, stepsPerFrame)
 *   sim.render(vizMode)
 *   // mouse:
 *   sim.seed.attachTo(renderer.domElement)
 */
import * as THREE from 'three'
import { PingPong } from './PingPong.js'
import { SimShader } from './SimShader.js'
import { VizShader } from './VizShader.js'
import { SeedShader } from './SeedShader.js'

export class GPUSim {
  constructor(renderer, size = 256, stencil = '5pt') {
    this.renderer = renderer
    this.size = size
    this.stencil = stencil

    this.pp = new PingPong(renderer, size, size)
    this.sim = new SimShader(stencil)
    this.viz = new VizShader()
    this.seed = new SeedShader()

    this.sim.update({ size })
    this.viz.setTexelSize(size, size)
  }

  /**
   * Initialize with u=1, v=0, with a seeded center patch.
   * Optionally pass custom Float32Array RGBA data.
   */
  reset(params, customData = null) {
    const size = this.size
    let data
    if (customData) {
      data = customData
    } else {
      data = new Float32Array(size * size * 4)
      // u=1, v=0 everywhere
      for (let i = 0; i < size * size; i++) {
        data[i*4+0] = 1.0
        data[i*4+1] = 0.0
        data[i*4+2] = 0.0
        data[i*4+3] = 1.0
      }
      // Seed center 10x10 square with v=1, u=0
      const cx = Math.floor(size/2), cy = Math.floor(size/2)
      const r = 8
      for (let y = cy-r; y <= cy+r; y++) {
        for (let x = cx-r; x <= cx+r; x++) {
          const yy = ((y%size)+size)%size
          const xx = ((x%size)+size)%size
          const i = yy*size + xx
          data[i*4+0] = 0.0
          data[i*4+1] = 1.0
        }
      }
    }
    this.pp.seed(data)
    if (params) this.sim.update({ ...params, size })
  }

  /**
   * Run N simulation steps.
   */
  step(params, n = 1) {
    if (params) this.sim.update(params)

    for (let i = 0; i < n; i++) {
      // Optional seed pass
      if (this.seed.isActive) {
        this.seed.render(this.renderer, this.pp.read, this.pp.write)
        this.pp.swap()
      }
      // Simulation step
      this.sim.render(this.renderer, this.pp.read, this.pp.write)
      this.pp.swap()
    }
  }

  /**
   * Render simulation result to screen.
   * @param {string} mode - 'grayscale' | 'invert' | 'dual' | 'contour' | 'edge'
   */
  render(mode = 'grayscale') {
    this.viz.setMode(mode)
    this.viz.render(this.renderer, this.pp.read.texture)
  }

  dispose() {
    this.pp.dispose()
    this.sim.dispose()
    this.viz.dispose()
    this.seed.dispose()
  }
}
