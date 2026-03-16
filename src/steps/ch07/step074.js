/**
 * Step 74: RK4 on the GPU: Four Ping-Pong Passes
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'RK4 on the GPU: Four Ping-Pong Passes',
  chapter: 7,

  math: `<div class="math-section"><h3>RK4 GPU Implementation</h3>
<p>Each of the 4 stages requires a separate FBO render pass.
RK4 needs 4 additional temporary FBOs: k1–k4 storage.
This is 4× more GPU memory and render calls than Euler.</p></div>`,

  code: `<div class="code-section"><h3>Step 74 Code</h3>
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
