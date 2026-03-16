/**
 * Step 28: 5-Point vs 9-Point Laplacian Comparison
 */
import { createSimControls } from '../../utils/simControls.js'
import { getPreset } from '../../presets/parameters.js'

export default {
  title: '5-Point vs 9-Point Laplacian Comparison',
  chapter: 3,

  math: `
<div class="math-section">
  <h3>Quantitative Angular Error</h3>
  <p>The 5-point stencil has significant directional error that varies with wave direction:</p>
  <div class="math-block">$$\\frac{|\\nabla^2 u|_{5pt}}{|\\nabla^2 u|_{\\text{exact}}} \\approx 1 + 0.3\\sin^2(2\\theta)$$</div>
  <p>Maximum error of ~30% occurs at θ = 45°, 135°, etc. (diagonal directions)</p>
</div>
<div class="math-section">
  <h3>9-Point Improvement</h3>
  <p>The 9-point isotropic stencil reduces this to <1% for all angles:</p>
  <div class="math-block">$$\\frac{|\\nabla^2 u|_{9pt}}{|\\nabla^2 u|_{\\text{exact}}} \\approx 1 + 0.01\\sin^4(2\\theta)$$</div>
  <p>Fourth-order accuracy in angle vs second-order for 5-point.</p>
</div>
<div class="math-section">
  <h3>Spectral Accuracy</h3>
  <p>In Fourier space, the discrete Laplacian operator eigenvalues are:</p>
  <div class="math-block">$$\\lambda_{5pt}(k_x, k_y) = -4\\sin^2(k_x/2) - 4\\sin^2(k_y/2)$$</div>
  <div class="math-block">$$\\lambda_{9pt}(k_x, k_y) = -\\frac{10}{3} + \\frac{2}{3}[\\cos(k_x) + \\cos(k_y)] + \\frac{1}{6}[\\cos(k_x+k_y) + \\cos(k_x-k_y)]$$</div>
</div>
`,

  code: `
<div class="code-section">
  <h3>Performance Benchmark</h3>
  <div class="filename">Measuring computation time for both stencils</div>
<pre><code class="language-js">function benchmark5pt9pt(N = 128, steps = 1000) {
  // Setup arrays
  const size = N * N
  let u = new Float32Array(size), v = new Float32Array(size)
  let u2 = new Float32Array(size), v2 = new Float32Array(size)

  // Initialize with central square
  const m = Math.floor(N/2)
  for(let r = m-8; r < m+8; r++) {
    for(let c = m-8; c < m+8; c++) {
      const i = r*N + c
      u[i] = 0; v[i] = 1
    }
  }

  // Benchmark 5-point
  const t0 = performance.now()
  for(let step = 0; step < steps; step++) {
    step2D5pt(u, v, u2, v2, N, params)
    ;[u,u2] = [u2,u]; [v,v2] = [v2,v]
  }
  const dt5 = performance.now() - t0

  // Benchmark 9-point
  const t1 = performance.now()
  for(let step = 0; step < steps; step++) {
    step2D9pt(u, v, u2, v2, N, params)
    ;[u,u2] = [u2,u]; [v,v2] = [v2,v]
  }
  const dt9 = performance.now() - t1

  return { dt5, dt9, ratio: dt9/dt5 }
}
</code></pre>
</div>
<div class="code-section">
  <h3>GPU Shader Toggle</h3>
  <div class="filename">GLSL uniform flag to switch stencils</div>
<pre><code class="language-glsl">uniform bool useIsotropic;

vec4 laplacian(sampler2D tex, vec2 uv, vec2 texel) {
  if (useIsotropic) {
    return sample9pt(tex, uv, texel);
  } else {
    return sample5pt(tex, uv, texel);
  }
}
</code></pre>
</div>
`,

  init(container) {
    const N = 200

    // Create side-by-side wrapper
    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'display:flex;gap:8px;margin:auto;width:fit-content;align-items:flex-start'

    // Left canvas (5-point)
    const leftDiv = document.createElement('div')
    leftDiv.style.cssText = 'text-align:center'
    const label1 = document.createElement('div')
    label1.textContent = '5-Point Stencil'
    label1.style.cssText = 'font-family:SF Mono,monospace;font-size:11pt;margin-bottom:8px;font-weight:bold'
    const canvas1 = document.createElement('canvas')
    canvas1.id = 'canvas2d-a'
    canvas1.width = canvas1.height = N
    canvas1.style.cssText = 'border:1px solid #ccc;image-rendering:pixelated'
    leftDiv.appendChild(label1)
    leftDiv.appendChild(canvas1)

    // Right canvas (9-point)
    const rightDiv = document.createElement('div')
    rightDiv.style.cssText = 'text-align:center'
    const label2 = document.createElement('div')
    label2.textContent = '9-Point Isotropic'
    label2.style.cssText = 'font-family:SF Mono,monospace;font-size:11pt;margin-bottom:8px;font-weight:bold'
    const canvas2 = document.createElement('canvas')
    canvas2.id = 'canvas2d-b'
    canvas2.width = canvas2.height = N
    canvas2.style.cssText = 'border:1px solid #ccc;image-rendering:pixelated'
    rightDiv.appendChild(label2)
    rightDiv.appendChild(canvas2)

    wrapper.appendChild(leftDiv)
    wrapper.appendChild(rightDiv)
    container.appendChild(wrapper)

    const ctx1 = canvas1.getContext('2d')
    const ctx2 = canvas2.getContext('2d')
    const imageData1 = ctx1.createImageData(N, N)
    const imageData2 = ctx2.createImageData(N, N)

    // Initialize arrays for both simulations
    let u1 = new Float32Array(N*N), v1 = new Float32Array(N*N)
    let u1b = new Float32Array(N*N), v1b = new Float32Array(N*N)
    let u2 = new Float32Array(N*N), v2 = new Float32Array(N*N)
    let u2b = new Float32Array(N*N), v2b = new Float32Array(N*N)

    const params = getPreset('spots')

    function initCentralSquare() {
      // Clear arrays
      u1.fill(1); v1.fill(0)
      u2.fill(1); v2.fill(0)

      // Central square seed
      const m = Math.floor(N/2)
      for(let r = m-8; r < m+8; r++) {
        for(let c = m-8; c < m+8; c++) {
          const i = r*N + c
          u1[i] = u2[i] = 0
          v1[i] = v2[i] = 1
        }
      }
    }

    function step2D5pt(u, v, u2, v2) {
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
    }

    function step2D9pt(u, v, u2, v2) {
      const w1 = 1/6, w2 = 1/12, wc = 5/3

      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const i = r*N + c
          const rp = (r+1) % N, rm = (r-1+N) % N
          const cp = (c+1) % N, cm = (c-1+N) % N

          const lapU = w1*(u[rp*N+c] + u[rm*N+c] + u[r*N+cp] + u[r*N+cm]) +
                       w2*(u[rp*N+cp] + u[rp*N+cm] + u[rm*N+cp] + u[rm*N+cm]) -
                       wc*u[i]
          const lapV = w1*(v[rp*N+c] + v[rm*N+c] + v[r*N+cp] + v[r*N+cm]) +
                       w2*(v[rp*N+cp] + v[rp*N+cm] + v[rm*N+cp] + v[rm*N+cm]) -
                       wc*v[i]
          const uvv = u[i] * v[i] * v[i]

          u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
          v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
        }
      }
    }

    function render() {
      // Render 5-point result
      const data1 = imageData1.data
      for (let i = 0; i < N*N; i++) {
        const gray = Math.floor(u1[i] * 255)
        const idx = i * 4
        data1[idx] = data1[idx+1] = data1[idx+2] = gray
        data1[idx+3] = 255
      }
      ctx1.putImageData(imageData1, 0, 0)

      // Render 9-point result
      const data2 = imageData2.data
      for (let i = 0; i < N*N; i++) {
        const gray = Math.floor(u2[i] * 255)
        const idx = i * 4
        data2[idx] = data2[idx+1] = data2[idx+2] = gray
        data2[idx+3] = 255
      }
      ctx2.putImageData(imageData2, 0, 0)
    }

    initCentralSquare()
    let animId, paused = false

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { initCentralSquare() }
    })

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        for (let i = 0; i < 8; i++) {
          step2D5pt(u1, v1, u1b, v1b)
          ;[u1, u1b] = [u1b, u1];[v1, v1b] = [v1b, v1]

          step2D9pt(u2, v2, u2b, v2b)
          ;[u2, u2b] = [u2b, u2];[v2, v2b] = [v2b, v2]
        }
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
