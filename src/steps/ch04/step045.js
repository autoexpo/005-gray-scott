/**
 * Step 45: Passing Uniforms: f, k, Du, Dv, dt
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Passing Uniforms: f, k, Du, Dv, dt',
  chapter: 4,

  math: `<div class="math-section"><h3>Shader Uniforms</h3>
<p>Uniforms are values passed from JavaScript to GLSL each frame.
They allow parameter changes without recompiling the shader.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// GLSL uniforms: CPU → GPU parameter bridge
// SimShader receives these every frame:
uniform float f;    // feed rate
uniform float k;    // kill rate
uniform float Du;   // U diffusion
uniform float Dv;   // V diffusion
uniform float dt;   // time step

// In JS (Three.js), set via material uniforms:
sim.sim.material.uniforms.f.value = params.f
sim.sim.material.uniforms.k.value = params.k

// Live editing: change params object → uniform updates → next frame uses new value
// No shader recompile needed — uniforms are just memory writes
params.f = 0.060  // changes next frame automatically
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
