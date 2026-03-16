/**
 * Grid — 2D typed array pair for CPU Gray-Scott simulation.
 *
 * U (food) and V (activator) are stored as flat Float32Arrays.
 * Front/back buffers swapped after each step to avoid aliasing.
 */
export class Grid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.n = width * height

    // Front and back buffers for U and V
    this.u  = new Float32Array(this.n)
    this.v  = new Float32Array(this.n)
    this.u2 = new Float32Array(this.n)
    this.v2 = new Float32Array(this.n)
  }

  /** Convert 2D (row, col) to flat index with periodic wrap */
  idx(row, col) {
    const r = ((row % this.height) + this.height) % this.height
    const c = ((col % this.width)  + this.width)  % this.width
    return r * this.width + c
  }

  /** Fill entire grid: u=1, v=0 (homogeneous equilibrium) */
  fillHomogeneous() {
    this.u.fill(1.0)
    this.v.fill(0.0)
  }

  /**
   * Seed a square region of v=1, u=0 at center.
   * @param {number} size - half-width of seed square in cells
   */
  seedCenter(size = 5) {
    this.fillHomogeneous()
    const cx = Math.floor(this.width / 2)
    const cy = Math.floor(this.height / 2)
    for (let r = cy - size; r <= cy + size; r++) {
      for (let c = cx - size; c <= cx + size; c++) {
        const i = this.idx(r, c)
        this.u[i] = 0.0
        this.v[i] = 1.0
      }
    }
  }

  /**
   * Seed random patches of v throughout the grid.
   * @param {number} density - fraction of cells to seed [0..1]
   */
  seedRandom(density = 0.02) {
    this.fillHomogeneous()
    for (let i = 0; i < this.n; i++) {
      if (Math.random() < density) {
        this.u[i] = 0.0
        this.v[i] = 1.0
      }
    }
  }

  /** Swap front/back buffers after a step */
  swap() {
    const tu = this.u; this.u = this.u2; this.u2 = tu
    const tv = this.v; this.v = this.v2; this.v2 = tv
  }

  /** Export u buffer as RGBA Float32Array for GPU seeding */
  toFloatRGBA() {
    const data = new Float32Array(this.n * 4)
    for (let i = 0; i < this.n; i++) {
      data[i * 4 + 0] = this.u[i]
      data[i * 4 + 1] = this.v[i]
      data[i * 4 + 2] = 0
      data[i * 4 + 3] = 1
    }
    return data
  }

  /** Total mass: sum of all u + v */
  totalMass() {
    let s = 0
    for (let i = 0; i < this.n; i++) s += this.u[i] + this.v[i]
    return s
  }
}
