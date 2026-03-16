/**
 * Step 66: Contour Lines: Iso-Value Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Contour Lines: Iso-Value Rendering',
  chapter: 6,

  math: `<div class="math-section"><h3>Contour Lines</h3>
<p>Iso-value lines are rendered by detecting zero-crossings of (u - threshold).
In GLSL: if fract(u × N) < 0.05, draw a line. Creates a topographic map effect.</p></div>`,

  code: `<div class="code-section"><h3>Step 66 Code</h3>
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
      params: { ...PRESETS['stripes'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'contour',
    })
  }
}
