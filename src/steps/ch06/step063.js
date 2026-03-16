/**
 * Step 63: Multi-Band: Visualizing U and V Together
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Multi-Band: Visualizing U and V Together',
  chapter: 6,

  math: `<div class="math-section"><h3>Dual Channel: U and V</h3>
<p>Visualize both species simultaneously: u contributes to brightness, v to a different visual channel. In B&W: output = u × 0.6 + v × 0.4.</p></div>`,

  code: `<div class="code-section"><h3>Step 63 Code</h3>
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
      params: { ...PRESETS['mitosis'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'dual',
    })
  }
}
