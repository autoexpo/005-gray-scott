/**
 * Step 42: Integrating GPU Pipeline with Three.js
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Integrating GPU Pipeline with Three.js',
  chapter: 4,

  math: `<div class="math-section"><h3>Three.js Integration</h3>
<p>Three.js WebGLRenderTarget wraps an FBO. We use RawShaderMaterial to write
pure GLSL without Three.js shader chunks. The renderer handles context management.</p></div>`,

  code: `<div class="code-section"><h3>Step 42 Code</h3>
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
