/**
 * Step 45: Passing Uniforms — f, k, Du, Dv, dt
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Passing Uniforms — f, k, Du, Dv, dt',
  chapter: 4,

  math: `<div class="math-section">
<h3>GLSL Uniforms for Parameter Control</h3>
<p><strong>Uniforms vs Attributes:</strong> In GLSL, uniforms are constant across all fragments in a single draw call. They are set once per render call and remain the same for every pixel being computed.</p>

<p><strong>Uniform Hot-Swap:</strong> Parameters like f, k, Du, Dv, dt can be changed between draw calls without recompiling the shader. This enables real-time parameter exploration — the user can adjust sliders and see immediate effects.</p>

<p><strong>Performance Cost:</strong> Uploading uniforms to GPU via WebGL API takes approximately 1μs per uniform — negligible compared to the 500μs simulation step time.</p>

<p><strong>Parameter Upload Sequence:</strong></p>
<ol>
  <li>User moves GUI slider → onChange callback fires</li>
  <li>JavaScript updates parameter object</li>
  <li>SimShader.update() called → uniforms uploaded to GPU</li>
  <li>Next draw call uses new parameter values</li>
  <li>Effect visible in next frame (16ms later)</li>
</ol>

<p>This creates a tight feedback loop enabling interactive exploration of the Gray-Scott parameter space.</p>
</div>`,

  code: `<div class="code-section">
<h3>SimShader.js update() Method</h3>
<p>The parameter-to-uniform pipeline:</p>
<pre><code class="language-js">update(params) {
  const u = this.material.uniforms
  if (params.f    !== undefined) u.uF.value = params.f
  if (params.k    !== undefined) u.uK.value = params.k
  if (params.Du   !== undefined) u.uDu.value = params.Du
  if (params.Dv   !== undefined) u.uDv.value = params.Dv
  if (params.dt   !== undefined) u.uDt.value = params.dt
  if (params.size !== undefined) {
    u.uTexelSize.value.set(1/params.size, 1/params.size)
  }
}</code></pre>

<h3>GLSL Uniform Declarations</h3>
<p>In the fragment shader, uniforms are declared at the top:</p>
<pre><code class="language-glsl">precision highp float;

uniform sampler2D uState;     // Simulation texture
uniform vec2 uTexelSize;      // 1/width, 1/height
uniform float uF;             // Feed rate
uniform float uK;             // Kill rate
uniform float uDu;            // U diffusion coefficient
uniform float uDv;            // V diffusion coefficient
uniform float uDt;            // Time step size

varying vec2 vUv;             // Fragment UV coordinates

void main() {
  // Gray-Scott computation using the uniform values
  float uvv = u * v * v;
  float du = uDu * lapU - uvv + uF * (1.0 - u);
  float dv = uDv * lapV + uvv - (uF + uK) * v;
  // ...
}</code></pre>

<h3>lil-gui Integration — Live Parameter Control</h3>
<pre><code class="language-js">// GUI setup in gpuLoop.js
const simFolder = gui.addFolder('Simulation')
simFolder.add(simParams, 'f', 0.01, 0.12, 0.001).name('f (feed)')
  .onChange(v => { simParams.f = v })
simFolder.add(simParams, 'k', 0.04, 0.07, 0.001).name('k (kill)')
  .onChange(v => { simParams.k = v })
simFolder.add(simParams, 'Du', 0.05, 0.5, 0.001).name('Du')
  .onChange(v => { simParams.Du = v })
simFolder.add(simParams, 'Dv', 0.01, 0.3, 0.001).name('Dv')
  .onChange(v => { simParams.Dv = v })

// In the animation loop, uniforms are updated each frame:
sim.step(simParams, currentStepsPerFrame)  // Passes params to update()</code></pre>

<h3>Complete Parameter → Uniform Pipeline</h3>
<pre><code class="language-js">// 1. GUI slider moved
onChange(newValue => { simParams.f = newValue })

// 2. Animation loop passes params to sim.step()
sim.step(simParams, stepsPerFrame)

// 3. GPUSim.step() calls sim.update()
if (params) this.sim.update(params)

// 4. SimShader.update() uploads to GPU
if (params.f !== undefined) u.uF.value = params.f

// 5. Next render() call uses new uniform value
// Effect visible in next frame!</code></pre>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 8,
      showGui: true  // Enable parameter sliders for interactive exploration
    })
  }
}