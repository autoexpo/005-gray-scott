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
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
