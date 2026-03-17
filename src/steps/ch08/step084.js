/**
 * Step 84: Multi-Scale Simulation
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Multi-Scale Simulation',
  chapter: 8,

  math: `<div class="math-section"><h3>Multi-Scale Coupling</h3>
<p>Run a coarse and fine grid simultaneously. Coarse grid drives slow large-scale dynamics;
fine grid captures small-scale pattern detail. Downsampling/upsampling links the scales.</p></div>`,

  code: `<div class="code-section"><h3>Step 84 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,

  init(container, state) {
    // Create side-by-side layout
    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'display: flex; gap: 20px; justify-content: center; align-items: flex-start'
    container.appendChild(wrapper)

    const leftDiv = document.createElement('div')
    leftDiv.style.cssText = 'text-align: center'
    const rightDiv = document.createElement('div')
    rightDiv.style.cssText = 'text-align: center'

    wrapper.appendChild(leftDiv)
    wrapper.appendChild(rightDiv)

    // Labels
    const leftLabel = document.createElement('div')
    leftLabel.textContent = 'Coarse (128²)'
    leftLabel.style.cssText = 'font-family: SF Mono, monospace; font-size: 10pt; margin-bottom: 5px; font-weight: bold'
    leftDiv.appendChild(leftLabel)

    const rightLabel = document.createElement('div')
    rightLabel.textContent = 'Fine (512²)'
    rightLabel.style.cssText = 'font-family: SF Mono, monospace; font-size: 10pt; margin-bottom: 5px; font-weight: bold'
    rightDiv.appendChild(rightLabel)

    // Two GPU simulations at different scales
    const coarseCleanup = startGPULoop(leftDiv, {
      params: { ...PRESETS['mitosis'] },
      size: 128,  // Coarse resolution
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: false,
      showStats: false,
    })

    const fineCleanup = startGPULoop(rightDiv, {
      params: { ...PRESETS['mitosis'] },
      size: 512,  // Fine resolution
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: false,
      showStats: false,
    })

    return () => {
      coarseCleanup()
      fineCleanup()
      container.innerHTML = ''
    }
  }
}
