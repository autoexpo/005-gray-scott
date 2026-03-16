/**
 * Step 48: Preset System: Named Configurations
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset System: Named Configurations',
  chapter: 5,

  math: `<div class="math-section"><h3>Preset Loading</h3>
<p>A preset resets f, k, Du, Dv to known-good values and optionally resets the simulation grid.
Resetting the grid is needed when moving to a very different parameter regime.</p></div>`,

  code: `<div class="code-section"><h3>Step 48 Code</h3>
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
