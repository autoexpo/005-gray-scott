/**
 * Step 40: Float Precision — Packing u and v into RGBA
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Float Precision — Packing u and v into RGBA',
  chapter: 4,

  math: `<div class="math-section">
<h3>RGBA Texture Encoding and Float Precision</h3>
<p>The GPU simulation stores the state in a 2D texture where each pixel represents one grid point:</p>
<ul>
  <li><strong>R channel:</strong> u (food concentration)</li>
  <li><strong>G channel:</strong> v (activator concentration)</li>
  <li><strong>B channel:</strong> unused (set to 0.0)</li>
  <li><strong>A channel:</strong> always 1.0 (full opacity)</li>
</ul>

<p><strong>Float32 Precision:</strong> Modern GPUs use 32-bit floats, giving approximately 7 decimal digits of precision. For concentrations in [0,1], this means errors around $10^{-7}$ per operation.</p>

<p><strong>Error Accumulation:</strong> With half precision (float16), rounding errors accumulate over many time steps. For a typical simulation:</p>
<div class="katex-display">$$\\text{Total Error} \\approx N_{\\text{steps}} \\times \\epsilon_{\\text{step}}$$</div>
<div class="katex-display">$$1000 \\text{ steps} \\times 10^{-7} \\text{ per step} = 10^{-4} \\text{ total error}$$</div>

<p>This level of error (0.01% after 1000 steps) is acceptable for reaction-diffusion patterns, which are naturally stable to small perturbations.</p>
</div>`,

  code: `<div class="code-section">
<h3>Texture Initialization in GPUSim.reset()</h3>
<p>The simulation state is initialized as Float32Array RGBA data:</p>
<pre><code class="language-js">reset(params, customData = null) {
  const size = this.size
  let data
  if (customData) {
    data = customData
  } else {
    data = new Float32Array(size * size * 4)
    // u=1, v=0 everywhere
    for (let i = 0; i < size * size; i++) {
      data[i*4+0] = 1.0  // R = u (food)
      data[i*4+1] = 0.0  // G = v (activator)
      data[i*4+2] = 0.0  // B = unused
      data[i*4+3] = 1.0  // A = alpha
    }
    // Seed center 10x10 square with v=1, u=0
    const cx = Math.floor(size/2), cy = Math.floor(size/2)
    const r = 8
    for (let y = cy-r; y <= cy+r; y++) {
      for (let x = cx-r; x <= cx+r; x++) {
        const yy = ((y%size)+size)%size
        const xx = ((x%size)+size)%size
        const i = yy*size + xx
        data[i*4+0] = 0.0  // u = 0 (no food)
        data[i*4+1] = 1.0  // v = 1 (high activator)
      }
    }
  }
  this.pp.seed(data)
  if (params) this.sim.update({ ...params, size })
}</code></pre>

<h3>GLSL Texture Read/Write</h3>
<p>In the fragment shader, we read and write the state:</p>
<pre><code class="language-glsl">// Read current state
vec4 s = texture2D(uState, vUv);
float u = s.r;  // Extract u from red channel
float v = s.g;  // Extract v from green channel

// ... compute newU, newV ...

// Write next state
gl_FragColor = vec4(newU, newV, 0.0, 1.0);</code></pre>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.stripes,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 8,
      showGui: true
    })
  }
}