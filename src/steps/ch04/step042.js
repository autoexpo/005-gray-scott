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

  code: `<div class="code-section">
<pre><code class="language-js">// Three.js as WebGL abstraction for GPU compute
const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setSize(512, 512)

// Full-screen quad: 2×2 plane covers entire NDC space [-1,1]
// OrthographicCamera at z=1 looks straight down at it
// Every fragment = one simulation cell
const sim = new GPUSim(renderer, 256)  // 256×256 grid

// Each frame: compute + display
sim.step(params, 8)      // 8 Gray-Scott steps on GPU
sim.render('invert')     // viz pass: (u,v) → RGB
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
