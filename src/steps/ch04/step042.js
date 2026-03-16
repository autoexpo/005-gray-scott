/**
 * Step 42: Integrating GPU Pipeline with Three.js
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Integrating GPU Pipeline with Three.js',
  chapter: 4,

  math: `<div class="math-section">
<h3>Three.js as WebGL Abstraction Layer</h3>
<p><strong>Three.js Benefits:</strong> Provides high-level abstractions over raw WebGL, handling context management, resource cleanup, and cross-browser compatibility. However, for compute shaders, we need direct GLSL control.</p>

<p><strong>RawShaderMaterial:</strong> Bypasses Three.js's built-in shader chunks (lighting, fog, etc.) and uses pure GLSL. This gives us complete control over the fragment shader for Gray-Scott computation.</p>

<p><strong>WebGLRenderTarget as FBO:</strong> Three.js WebGLRenderTarget is an abstraction over WebGL Framebuffer Objects (FBOs). It allows us to render to off-screen textures instead of the canvas.</p>

<p><strong>Render Pipeline Flow:</strong></p>
<ol>
  <li>Set render target → off-screen FBO</li>
  <li>Render scene → computation happens in fragment shader</li>
  <li>Set render target null → switch back to screen canvas</li>
  <li>Render to screen → visualization pass</li>
</ol>
</div>`,

  code: `<div class="code-section">
<h3>GPUSim Constructor</h3>
<p>The GPUSim class orchestrates all GPU components:</p>
<pre><code class="language-js">constructor(renderer, size = 256, stencil = '5pt') {
  this.renderer = renderer
  this.size = size
  this.stencil = stencil

  this.pp = new PingPong(renderer, size, size)
  this.sim = new SimShader(stencil)
  this.viz = new VizShader()
  this.seed = new SeedShader()

  this.sim.update({ size })
  this.viz.setTexelSize(size, size)
}</code></pre>

<h3>GPUSim.step() Method — Orchestrating the Pipeline</h3>
<pre><code class="language-js">step(params, n = 1) {
  if (params) this.sim.update(params)

  for (let i = 0; i < n; i++) {
    // Optional seed pass
    if (this.seed.isActive) {
      this.seed.render(this.renderer, this.pp.read, this.pp.write)
      this.pp.swap()
    }
    // Simulation step
    this.sim.render(this.renderer, this.pp.read, this.pp.write)
    this.pp.swap()
  }
}</code></pre>

<h3>How SimShader, PingPong, VizShader Work Together</h3>
<pre><code class="language-js">// SimShader.render() — simulation pass
render(renderer, readTarget, writeTarget) {
  this.material.uniforms.uState.value = readTarget.texture
  renderer.setRenderTarget(writeTarget)  // Render to off-screen FBO
  renderer.render(this.scene, this.camera)
  renderer.setRenderTarget(null)         // Switch back to screen
}

// VizShader.render() — visualization pass
render(renderer, simTexture) {
  this.material.uniforms.uState.value = simTexture
  renderer.setRenderTarget(null)         // Render to screen
  renderer.render(this.scene, this.camera)
}</code></pre>

<p>The PingPong class manages two FBOs, swapping them each step so we always read from the previous frame's result while writing to a fresh target.</p>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.mitosis,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 4,
      showGui: true
    })
  }
}