/**
 * Step 26: Observing First Patterns — Spots from Noise
 */
import { createSimControls } from '../../utils/simControls.js'
import { getPreset } from '../../presets/parameters.js'

export default {
  title: 'Observing First Patterns — Spots from Noise',
  chapter: 3,

  math: `
<div class="math-section">
  <h3>Turing Instability Mechanism</h3>
  <p>Small random perturbations around the homogeneous steady state grow if the diffusion ratio exceeds a critical threshold:</p>
  <div class="math-block">$$\\frac{D_u}{D_v} > \\left(\\frac{1+\\sqrt{1+4\\sigma}}{2}\\right)^2$$</div>
  <p>where σ is determined by the reaction kinetics f and k.</p>
</div>
<div class="math-section">
  <h3>Homogeneous Steady State</h3>
  <p>The uniform steady state (u*, v*) is found by solving:</p>
  <div class="math-block">$$f(1-u^*) = u^* (v^*)^2$$</div>
  <div class="math-block">$$(f+k)v^* = u^* (v^*)^2$$</div>
  <p>For the spots preset (f=0.035, k=0.065): u* ≈ 0.965, v* ≈ 0.036</p>
</div>
<div class="math-section">
  <h3>Linear Stability Analysis</h3>
  <p>The growth rate σ(q) for wavenumber q around steady state:</p>
  <div class="math-block">$$\\sigma(q) = -q^2(D_u + D_v) + \\sqrt{\\Delta(q)}$$</div>
  <div class="math-block">$$\\Delta(q) = q^4(D_u - D_v)^2 + 4q^2 D_u D_v [f - 2u^* v^*]$$</div>
  <p>Patterns emerge when σ(q) > 0 for some wavenumber q.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Random Noise Initialization</h3>
  <div class="filename">Random perturbations around steady state</div>
<pre><code class="language-js">// Initialize with random noise around steady state
function initRandomNoise(u, v, N, amplitude = 0.1) {
  const uStar = 0.965, vStar = 0.036  // steady state for spots

  for (let i = 0; i < N*N; i++) {
    u[i] = uStar + amplitude * (Math.random() - 0.5)
    v[i] = vStar + amplitude * (Math.random() - 0.5)

    // Clamp to [0,1]
    u[i] = Math.max(0, Math.min(1, u[i]))
    v[i] = Math.max(0, Math.min(1, v[i]))
  }
}
</code></pre>
</div>
<div class="code-section">
  <h3>2D Gray-Scott Step (CPU)</h3>
  <div class="filename">5-point finite difference stencil</div>
<pre><code class="language-js">function step2D(u, v, u2, v2, N, params) {
  const { f, k, Du, Dv, dt } = params

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const i = r*N + c
      const up = ((r-1+N)%N)*N + c
      const dn = ((r+1)%N)*N + c
      const lt = r*N + (c-1+N)%N
      const rt = r*N + (c+1)%N

      // 5-point Laplacian
      const lapU = u[up] + u[dn] + u[lt] + u[rt] - 4*u[i]
      const lapV = v[up] + v[dn] + v[lt] + v[rt] - 4*v[i]

      // Reaction term
      const uvv = u[i] * v[i] * v[i]

      // Update with clamping
      u2[i] = Math.max(0, Math.min(1,
        u[i] + dt*(Du*lapU - uvv + f*(1-u[i]))
      ))
      v2[i] = Math.max(0, Math.min(1,
        v[i] + dt*(Dv*lapV + uvv - (f+k)*v[i])
      ))
    }
  }
}
</code></pre>
</div>
`,

  init(container) {
    const N = 256
    const canvas = document.createElement('canvas')
    canvas.id = 'canvas2d-sim'
    canvas.width = canvas.height = N
    canvas.style.cssText = 'display:block;margin:20px auto;border:1px solid #ccc;image-rendering:pixelated'
    container.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(N, N)

    // Initialize arrays
    let u = new Float32Array(N*N)
    let v = new Float32Array(N*N)
    let u2 = new Float32Array(N*N)
    let v2 = new Float32Array(N*N)

    const params = getPreset('spots')

    function initRandomNoise() {
      const uStar = 0.965, vStar = 0.036
      const amplitude = 0.1

      for (let i = 0; i < N*N; i++) {
        u[i] = uStar + amplitude * (Math.random() - 0.5)
        v[i] = vStar + amplitude * (Math.random() - 0.5)
        u[i] = Math.max(0, Math.min(1, u[i]))
        v[i] = Math.max(0, Math.min(1, v[i]))
      }
    }

    function step2D() {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const i = r*N + c
          const up = ((r-1+N)%N)*N + c
          const dn = ((r+1)%N)*N + c
          const lt = r*N + (c-1+N)%N
          const rt = r*N + (c+1)%N

          const lapU = u[up] + u[dn] + u[lt] + u[rt] - 4*u[i]
          const lapV = v[up] + v[dn] + v[lt] + v[rt] - 4*v[i]
          const uvv = u[i] * v[i] * v[i]

          u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
          v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
        }
      }
      ;[u, u2] = [u2, u];[v, v2] = [v2, v]
    }

    function render() {
      const data = imageData.data
      for (let i = 0; i < N*N; i++) {
        const gray = Math.floor(u[i] * 255)
        const idx = i * 4
        data[idx] = data[idx+1] = data[idx+2] = gray
        data[idx+3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    initRandomNoise()
    let animId, paused = false

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { initRandomNoise() }
    })

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        for (let i = 0; i < 8; i++) step2D()
      }
      render()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.innerHTML = ''
    }
  }
}