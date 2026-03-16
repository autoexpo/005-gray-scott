/**
 * Step 65: Edge Detection: Sobel Filter
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Edge Detection: Sobel Filter',
  chapter: 6,

  math: `<div class="math-section"><h3>Sobel Edge Detection</h3>
<p>The Sobel operator computes the gradient magnitude of u, highlighting boundaries between pattern and background.
$$|\\nabla u| = \\sqrt{G_x^2 + G_y^2}$$</p></div>`,

  code: `<div class="code-section"><h3>Step 65 Code</h3>
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
      vizMode: 'edge',
    })
  }
}
