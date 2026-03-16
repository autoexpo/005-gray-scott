/**
 * Step 54: Preset: Coral (f=0.059, k=0.062)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Coral (f=0.059, k=0.062)',
  chapter: 5,

  math: `<div class="math-section"><h3>Coral Pattern</h3>
<p>f=0.059, k=0.062: Dendritic, branching structures resembling coral.
Similar to diffusion-limited aggregation (DLA) patterns.</p></div>`,

  code: `<div class="code-section"><h3>Step 54 Code</h3>
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
    return startGPULoop(container, {
      params: { ...PRESETS['coral'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
