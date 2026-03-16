/**
 * Step 29: Boundary Conditions in 2D
 */
import { createSimControls } from '../../utils/simControls.js'
import { getPreset } from '../../presets/parameters.js'

export default {
  title: 'Boundary Conditions in 2D',
  chapter: 3,

  math: `
<div class="math-section">
  <h3>Periodic Boundary Conditions (Torus)</h3>
  <p>The domain wraps around like a torus. For a grid point at (0, j):</p>
  <div class="math-block">$$u_{-1,j} = u_{N-1,j}, \\quad u_{N,j} = u_{0,j}$$</div>
  <p>This is implemented via modular arithmetic: (i-1+N)%N and (i+1)%N</p>
</div>
<div class="math-section">
  <h3>Dirichlet Boundary Conditions</h3>
  <p>Fixed values at all boundaries. For Gray-Scott, typically:</p>
  <div class="math-block">$$u = 1, \\quad v = 0 \\quad \\text{on } \\partial\\Omega$$</div>
  <p>This represents a constant food supply and predator sink at edges.</p>
</div>
<div class="math-section">
  <h3>Neumann Boundary Conditions</h3>
  <p>Zero normal flux (no-penetration). Implemented via ghost cells:</p>
  <div class="math-block">$$\\frac{\\partial u}{\\partial n} = 0 \\quad \\Rightarrow \\quad u_{-1,j} = u_{1,j}$$</div>
  <p>GPU equivalent: CLAMP_TO_EDGE texture wrap mode</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>CPU Implementation of All Three BCs</h3>
  <div class="filename">Boundary condition handling in 2D</div>
<pre><code class="language-js">function step2DWithBC(u, v, u2, v2, N, params, bc = 'periodic') {
  function getIndex(r, c) {
    switch (bc) {
      case 'periodic':
        return ((r+N)%N)*N + (c+N)%N

      case 'dirichlet':
        // Clamp indices, then handle boundary values
        const rr = Math.max(0, Math.min(N-1, r))
        const cc = Math.max(0, Math.min(N-1, c))
        return rr*N + cc

      case 'neumann':
        // Mirror/reflect indices
        let rr = r, cc = c
        if (r < 0) rr = -r
        else if (r >= N) rr = 2*N-2-r
        if (c < 0) cc = -c
        else if (c >= N) cc = 2*N-2-c
        return rr*N + cc
    }
  }

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const i = r*N + c

      // Handle boundary conditions via getIndex
      const lapU = u[getIndex(r-1,c)] + u[getIndex(r+1,c)] +
                   u[getIndex(r,c-1)] + u[getIndex(r,c+1)] - 4*u[i]
      const lapV = v[getIndex(r-1,c)] + v[getIndex(r+1,c)] +
                   v[getIndex(r,c-1)] + v[getIndex(r,c+1)] - 4*v[i]

      const uvv = u[i] * v[i] * v[i]
      u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
      v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
    }
  }

  // Apply Dirichlet BCs after update
  if (bc === 'dirichlet') {
    for (let i = 0; i < N; i++) {
      u2[i] = u2[(N-1)*N+i] = 1  // top/bottom edges
      v2[i] = v2[(N-1)*N+i] = 0
      u2[i*N] = u2[i*N+(N-1)] = 1  // left/right edges
      v2[i*N] = v2[i*N+(N-1)] = 0
    }
  }
}
</code></pre>
</div>
<div class="code-section">
  <h3>GLSL Texture Wrapping</h3>
  <div class="filename">GPU boundary conditions via texture modes</div>
<pre><code class="language-js">// Three.js texture setup
texture.wrapS = texture.wrapT = THREE.RepeatWrapping    // Periodic
texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping  // Neumann-like

// GLSL sampling (Dirichlet requires custom shader logic)
vec4 sample = texture(sampler, uv)  // GPU handles wrapping automatically
</code></pre>
</div>
`,

  init(container) {
    const N = 100

    // Create wrapper for three canvases
    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'display:flex;gap:8px;margin:auto;width:fit-content;align-items:flex-start;flex-wrap:wrap'

    const labels = ['Periodic', 'Dirichlet', 'Neumann']
    const canvases = []
    const contexts = []
    const imageDatas = []

    // Create three canvases
    for (let i = 0; i < 3; i++) {
      const div = document.createElement('div')
      div.style.cssText = 'text-align:center;margin-bottom:10px'

      const label = document.createElement('div')
      label.textContent = labels[i]
      label.style.cssText = 'font-family:SF Mono,monospace;font-size:11pt;margin-bottom:8px;font-weight:bold'

      const canvas = document.createElement('canvas')
      canvas.id = `canvas2d-${String.fromCharCode(97+i)}` // a, b, c
      canvas.width = canvas.height = N
      canvas.style.cssText = 'border:1px solid #ccc;image-rendering:pixelated'

      div.appendChild(label)
      div.appendChild(canvas)
      wrapper.appendChild(div)

      canvases.push(canvas)
      contexts.push(canvas.getContext('2d'))
      imageDatas.push(contexts[i].createImageData(N, N))
    }

    container.appendChild(wrapper)

    // Initialize simulation arrays for each BC
    const sims = []
    for (let i = 0; i < 3; i++) {
      sims.push({
        u: new Float32Array(N*N),
        v: new Float32Array(N*N),
        u2: new Float32Array(N*N),
        v2: new Float32Array(N*N),
        bc: ['periodic', 'dirichlet', 'neumann'][i]
      })
    }

    const params = getPreset('spots')

    function getIndex(r, c, bc) {
      switch (bc) {
        case 'periodic':
          return ((r+N)%N)*N + ((c+N)%N)

        case 'dirichlet':
          const rr = Math.max(0, Math.min(N-1, r))
          const cc = Math.max(0, Math.min(N-1, c))
          return rr*N + cc

        case 'neumann':
          let rrr = r, ccc = c
          if (r < 0) rrr = -r
          else if (r >= N) rrr = 2*N-2-r
          if (c < 0) ccc = -c
          else if (c >= N) ccc = 2*N-2-c
          return rrr*N + ccc
      }
    }

    function initSims() {
      for (let i = 0; i < 3; i++) {
        const sim = sims[i]
        sim.u.fill(1)
        sim.v.fill(0)

        // Central square seed
        const m = Math.floor(N/2)
        for(let r = m-6; r < m+6; r++) {
          for(let c = m-6; c < m+6; c++) {
            const idx = r*N + c
            sim.u[idx] = 0
            sim.v[idx] = 1
          }
        }
      }
    }

    function stepSim(sim) {
      const { u, v, u2, v2, bc } = sim

      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const i = r*N + c

          const lapU = u[getIndex(r-1,c,bc)] + u[getIndex(r+1,c,bc)] +
                       u[getIndex(r,c-1,bc)] + u[getIndex(r,c+1,bc)] - 4*u[i]
          const lapV = v[getIndex(r-1,c,bc)] + v[getIndex(r+1,c,bc)] +
                       v[getIndex(r,c-1,bc)] + v[getIndex(r,c+1,bc)] - 4*v[i]

          const uvv = u[i] * v[i] * v[i]
          u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
          v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
        }
      }

      // Apply Dirichlet BCs
      if (bc === 'dirichlet') {
        for (let j = 0; j < N; j++) {
          u2[j] = u2[(N-1)*N+j] = 1  // top/bottom
          v2[j] = v2[(N-1)*N+j] = 0
          u2[j*N] = u2[j*N+(N-1)] = 1  // left/right
          v2[j*N] = v2[j*N+(N-1)] = 0
        }
      }

      // Swap buffers
      ;[sim.u, sim.u2] = [sim.u2, sim.u]
      ;[sim.v, sim.v2] = [sim.v2, sim.v]
    }

    function render() {
      for (let i = 0; i < 3; i++) {
        const data = imageDatas[i].data
        const u = sims[i].u
        for (let j = 0; j < N*N; j++) {
          const gray = Math.floor(u[j] * 255)
          const idx = j * 4
          data[idx] = data[idx+1] = data[idx+2] = gray
          data[idx+3] = 255
        }
        contexts[i].putImageData(imageDatas[i], 0, 0)
      }
    }

    // Pre-compute 1500 steps to show final state
    initSims()
    for (let step = 0; step < 1500; step++) {
      for (let i = 0; i < 3; i++) {
        stepSim(sims[i])
      }
    }
    render()

    // Now animate
    let animId, paused = false
    let stepCount = 0

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => {
        initSims()
        stepCount = 0
      }
    })

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused && stepCount < 3000) {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 3; j++) {
            stepSim(sims[j])
          }
          stepCount++
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
