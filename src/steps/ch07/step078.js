/**
 * Step 78: Anti-Aliasing: Bilinear vs Nearest Sampling
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Anti-Aliasing: Bilinear vs Nearest Sampling',
  chapter: 7,

  math: `<div class="math-section"><h3>Sampling and Anti-Aliasing</h3>
<p>Nearest-neighbour sampling (magnification) shows individual pixels — good for
seeing simulation state. Bilinear filtering smooths the display — better aesthetic.</p></div>`,

  code: `<div class="code-section"><h3>Step 78 Code</h3>
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
