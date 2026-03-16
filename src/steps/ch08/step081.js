/**
 * Step 81: Anisotropic Diffusion Tensor
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Anisotropic Diffusion Tensor',
  chapter: 8,

  math: `<div class="math-section"><h3>Anisotropic Diffusion</h3>
<p>Replace the scalar Du, Dv with 2×2 diffusion tensors D:
$$\nabla \cdot (D \nabla u)$$
This allows directional diffusion — patterns oriented along a preferred axis.</p></div>`,

  code: `<div class="code-section"><h3>Step 81 Code</h3>
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
