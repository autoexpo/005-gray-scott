/**
 * Step 68: Tiling: Multi-Scale Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Tiling: Multi-Scale Rendering',
  chapter: 6,

  math: `<div class="math-section"><h3>Tiled Multi-Scale View</h3>
<p>Render multiple copies of the simulation at different UV scales in a grid.
Shows self-similarity of patterns across scale.</p></div>`,

  code: `<div class="code-section"><h3>Step 68 Code</h3>
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
