/**
 * Template factory for steps that are primarily GPU simulations
 * with different parameters/viz modes.
 */
import { startGPULoop } from '../utils/gpuLoop.js'
import { PRESETS } from '../presets/parameters.js'

export function makeGPUStep(config) {
  return {
    title: config.title,
    chapter: config.chapter,
    math: config.math || '<div class="math-section"><p>See visualization →</p></div>',
    code: config.code || '<div class="code-section"><p>See source files.</p></div>',
    init(container, state) {
      return startGPULoop(container, {
        params: config.params || { ...PRESETS.spots },
        size: config.size || 256,
        stencil: config.stencil || '5pt',
        stepsPerFrame: config.stepsPerFrame || 8,
        vizMode: config.vizMode || 'invert',
        showGui: config.showGui !== false,
        showStats: config.showStats !== false,
        mouse: config.mouse !== false,
        onGui: config.onGui || null,
        onFrame: config.onFrame || null,
      })
    }
  }
}

/**
 * Simple static text step (no simulation).
 */
export function makeTextStep(config) {
  return {
    title: config.title,
    chapter: config.chapter,
    math: config.math || '',
    code: config.code || '',
    init(container) {
      const div = document.createElement('div')
      div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; height:100%; overflow-y:auto'
      div.innerHTML = config.viz || `<pre style="border:none; background:none">${config.title}</pre>`
      container.appendChild(div)
      return () => { container.innerHTML = '' }
    }
  }
}
