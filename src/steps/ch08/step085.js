/**
 * Step 85: 3D Extension Concept: Volumetric RD
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: '3D Extension Concept: Volumetric RD',
  chapter: 8,

  math: `<div class="math-section"><h3>3D Reaction-Diffusion</h3>
<p>Extend to 3D: store U(x,y,z) in a 3D texture. The Laplacian has 6 cardinal neighbours.
Patterns in 3D include: tubes, sheets, spherical shells, and gyroid-like structures.</p></div>`,

  code: `<div class="code-section"><h3>Step 85 Code</h3>
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
