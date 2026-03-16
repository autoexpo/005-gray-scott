/**
 * Step 58: Seeding Shader: GPU-Side Paint
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Seeding Shader: GPU-Side Paint',
  chapter: 5,

  math: `<div class="math-section"><h3>GPU Seeding Shader</h3>
<p>The seeding pass runs as an additional render pass before the simulation step.
It writes V=1, U=0 in a circular region centered on the mouse UV coordinate.</p></div>`,

  code: `<div class="code-section"><h3>Step 58 Code</h3>
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
