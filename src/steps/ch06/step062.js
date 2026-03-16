/**
 * Step 62: Gradient Mapping: Two-Color Interpolation
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Gradient Mapping: Two-Color Interpolation',
  chapter: 6,

  math: `<div class="math-section"><h3>Two-Color Gradient</h3>
<p>Linearly interpolate between two colors (in B&W: two grays) as a function of u.
The effective range [0.3, 0.7] is where most pattern information lives.</p></div>`,

  code: `<div class="code-section"><h3>Step 62 Code</h3>
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
      params: { ...PRESETS['worms'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
