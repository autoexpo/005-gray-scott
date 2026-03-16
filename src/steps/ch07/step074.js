/**
 * Step 74: RK4 on the GPU — Four Ping-Pong Passes
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'RK4 on the GPU — Four Ping-Pong Passes',
  chapter: 7,

  math: `<div class="math-section"><h3>GPU RK4 Implementation</h3>
<p>GPU RK4 requires 4 render passes with ping-pong buffers:</p>
<div class="math-block">$$\\text{Pass 1:} \\quad k_1 = F(u^n) \\quad \\rightarrow \\text{FBO}_1$$</div>
<div class="math-block">$$\\text{Pass 2:} \\quad k_2 = F(u^n + \\frac{\\Delta t}{2} k_1) \\quad \\rightarrow \\text{FBO}_2$$</div>
<div class="math-block">$$\\text{Pass 3:} \\quad k_3 = F(u^n + \\frac{\\Delta t}{2} k_2) \\quad \\rightarrow \\text{FBO}_3$$</div>
<div class="math-block">$$\\text{Pass 4:} \\quad k_4 = F(u^n + \\Delta t \\cdot k_3) \\quad \\rightarrow \\text{FBO}_4$$</div>
<div class="math-block">$$\\text{Final:} \\quad u^{n+1} = u^n + \\frac{\\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$</div>
<p><strong>Memory overhead</strong>: 4 additional FBOs for intermediate k values</p>
<p><strong>Bandwidth cost</strong>: 4 passes × 2 channels × N² texels = 8N² texture reads per step</p>
<p><strong>For N=256</strong>: 8 × 65536 = 524288 reads per step (still fast on modern GPUs)</p>
<p><strong>When worth it</strong>: RK4 allows larger dt, but at 4× the memory and compute cost vs Euler</p>
<p>For Gray-Scott at typical parameters, Euler with dt=1.0 is sufficiently accurate and much cheaper.</p></div>`,

  code: `<div class="code-section"><h3>GPU RK4 Pseudocode</h3>
<pre><code class="language-js">// GPU RK4 with ping-pong buffer management
class GPURK4Integrator {
  constructor(renderer, size) {
    this.renderer = renderer
    this.size = size

    // Main ping-pong buffers
    this.bufferA = createRenderTarget(size, size)
    this.bufferB = createRenderTarget(size, size)

    // Intermediate stage buffers
    this.k1Buffer = createRenderTarget(size, size)
    this.k2Buffer = createRenderTarget(size, size)
    this.k3Buffer = createRenderTarget(size, size)
    this.k4Buffer = createRenderTarget(size, size)

    this.rk4Shader = new RK4Shader()
  }

  step(params, dt) {
    const current = this.bufferA
    const next = this.bufferB

    // Stage 1: k1 = F(u)
    this.rk4Shader.uniforms.stage.value = 1
    this.rk4Shader.uniforms.dt.value = dt
    this.rk4Shader.uniforms.inputTexture.value = current.texture
    this.renderer.setRenderTarget(this.k1Buffer)
    this.renderer.render(this.scene, this.camera)

    // Stage 2: k2 = F(u + dt/2 * k1)
    this.rk4Shader.uniforms.stage.value = 2
    this.rk4Shader.uniforms.k1Texture.value = this.k1Buffer.texture
    this.renderer.setRenderTarget(this.k2Buffer)
    this.renderer.render(this.scene, this.camera)

    // Stage 3: k3 = F(u + dt/2 * k2)
    this.rk4Shader.uniforms.stage.value = 3
    this.rk4Shader.uniforms.k2Texture.value = this.k2Buffer.texture
    this.renderer.setRenderTarget(this.k3Buffer)
    this.renderer.render(this.scene, this.camera)

    // Stage 4: k4 = F(u + dt * k3)
    this.rk4Shader.uniforms.stage.value = 4
    this.rk4Shader.uniforms.k3Texture.value = this.k3Buffer.texture
    this.renderer.setRenderTarget(this.k4Buffer)
    this.renderer.render(this.scene, this.camera)

    // Final combination: u_new = u + dt/6*(k1+2*k2+2*k3+k4)
    this.rk4Shader.uniforms.stage.value = 5 // Final stage
    this.rk4Shader.uniforms.k4Texture.value = this.k4Buffer.texture
    this.renderer.setRenderTarget(next)
    this.renderer.render(this.scene, this.camera)

    // Swap buffers
    this.bufferA = next
    this.bufferB = current
  }
}

// Performance comparison
function compareTiming() {
  const euler1x = 1.0    // 1 pass per step
  const rk4_1x = 4.0     // 4 passes per step
  const euler4x = 4.0    // 4× smaller dt = 4× more steps

  console.log('Same accuracy comparison:')
  console.log(\`Euler (dt/4): \${euler4x} passes\`)
  console.log(\`RK4 (dt):     \${rk4_1x} passes\`)
  console.log('Winner: roughly equivalent cost')
}</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      size: 256,
      vizMode: 'bw',
      stepsPerFrame: 4,
      showGui: true
    })
  }
}
