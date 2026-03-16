/**
 * Step 55: Preset: Solitons (Traveling Pulses)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Solitons (Traveling Pulses)',
  chapter: 5,

  math: `<div class="math-section"><h3>Solitons</h3>
<p>f=0.030, k=0.057: Traveling wave pulses that maintain their shape.
"Soliton" because they pass through each other without dispersion.</p></div>`,

  code: `<div class="code-section"><h3>Step 55 Code</h3>
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
      params: { ...PRESETS['solitons'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
