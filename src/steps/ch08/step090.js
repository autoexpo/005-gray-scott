/**
 * Step 90: Coupling Two Gray-Scott Layers
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Coupling Two Gray-Scott Layers',
  chapter: 8,

  math: `<div class="math-section"><h3>Two-Layer Coupling</h3>
<p>Run two independent Gray-Scott systems and weakly couple them:
$u_1$ is influenced by $u_2$ and vice versa. The coupled system can produce
patterns impossible in a single layer.</p></div>`,

  code: `<div class="code-section"><h3>Step 90 Code</h3>
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
