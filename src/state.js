/**
 * CourseState — central singleton for all step state.
 * Emits 'stepchange' when navigation occurs.
 */

export const TOTAL_STEPS = 100

export const defaultParams = {
  f: 0.055,
  k: 0.062,
  Du: 0.2097,
  Dv: 0.105,
  dt: 1.0,
  gridSize: 256,
  stepsPerFrame: 8,
  colorMode: 'grayscale',
  boundaryMode: 'periodic',
  paused: false,
}

class CourseState extends EventTarget {
  constructor() {
    super()
    this.stepIndex = 0
    this.params = { ...defaultParams }
    this.gpuAvailable = false
    this.renderer = null      // THREE.WebGLRenderer
    this.scene = null
    this.camera = null
    this.animFrameId = null
    this._stepCleanup = null  // cleanup fn from current step
  }

  setStep(idx, cleanup) {
    this.stepIndex = idx
    this._stepCleanup = cleanup || null
    this.dispatchEvent(new CustomEvent('stepchange', { detail: { index: idx } }))
  }

  runCleanup() {
    if (this._stepCleanup) {
      this._stepCleanup()
      this._stepCleanup = null
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
  }

  updateParam(key, value) {
    this.params[key] = value
    this.dispatchEvent(new CustomEvent('paramchange', { detail: { key, value } }))
  }

  resetParams(preset) {
    Object.assign(this.params, preset)
    this.dispatchEvent(new CustomEvent('paramsreset', { detail: preset }))
  }
}

export const state = new CourseState()
