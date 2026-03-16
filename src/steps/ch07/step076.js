/**
 * Step 76: Adaptive Time Stepping
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Adaptive Time Stepping',
  chapter: 7,

  math: `<div class="math-section"><h3>Adaptive Time Stepping</h3>
<p>Compare the result of one large step vs two half-steps. If they differ by more
than a tolerance, halve dt. This automatically avoids instability while maximizing speed.</p></div>`,

  code: `<div class="code-section"><h3>Step 76 Code</h3>
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
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
