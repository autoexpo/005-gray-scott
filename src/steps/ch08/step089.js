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
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
