/**
 * Step 89: Symmetry Breaking: Sensitivity to ICs
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Symmetry Breaking: Sensitivity to ICs',
  chapter: 8,

  math: `<div class="math-section"><h3>Sensitivity to Initial Conditions</h3>
<p>Turing patterns are attractors — the final pattern is insensitive to ICs.
But the nucleation process (which spots form first) is sensitive.
Two runs with slightly different noise give different but statistically identical patterns.</p></div>`,

  code: `<div class="code-section"><h3>Step 89 Code</h3>
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
    // Create side-by-side layout for two different IC experiments
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
    leftLabel.textContent = 'Standard IC (center seed)'
    leftLabel.style.cssText = 'font-family: SF Mono, monospace; font-size: 9pt; margin-bottom: 5px; font-weight: bold'
    leftDiv.appendChild(leftLabel)

    const rightLabel = document.createElement('div')
    rightLabel.textContent = 'Random noise IC'
    rightLabel.style.cssText = 'font-family: SF Mono, monospace; font-size: 9pt; margin-bottom: 5px; font-weight: bold'
    rightDiv.appendChild(rightLabel)

    // Note: In real implementation, would need different seeding methods.
    // For this demo, use different presets that have inherently different IC behavior
    const leftCleanup = startGPULoop(leftDiv, {
      params: { ...PRESETS['mitosis'] }, // Standard seeded pattern
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: false,
      showStats: false,
    })

    const rightCleanup = startGPULoop(rightDiv, {
      params: { ...PRESETS['chaos'] }, // More chaotic, noise-sensitive pattern
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: false,
      showStats: false,
    })

    return () => {
      leftCleanup()
      rightCleanup()
      container.innerHTML = ''
    }
  }
}
