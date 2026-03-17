/**
 * Step 72: Numerical Instability Demo: dt Too Large
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Numerical Instability Demo: dt Too Large',
  chapter: 7,

  math: `<div class="math-section"><h3>Instability from Large dt</h3>
<p>When dt exceeds the stability limit, the simulation "blows up" — values oscillate
wildly and quickly hit NaN. This demo sets dt=3.0 to show the blow-up phenomenon.</p>
<p><strong>CFL limit:</strong> dt ≤ h²/(2D) ≈ 1.19 for our parameters. dt=3.0 > 1.19 → unstable.</p>
<p><strong>Expected behavior:</strong> Canvas turns uniform gray within ~20 frames (NaN clamps to 0).</p></div>`,

  code: `<div class="code-section"><h3>Step 72 Code</h3>
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
      params: { ...PRESETS['spots'], dt: 3.0 },  // Override dt to unstable value
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
