/**
 * Step 17: Effect of Changing Du and Dv in 1D
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Effect of Changing Du and Dv in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Diffusion Ratio Du/Dv</h3>
<p>The ratio Du/Dv is critical for Turing instability. Standard: Du=0.2097, Dv=0.105 (ratio 2).</p>
<p>Reducing the ratio reduces pattern contrast; ratio below ~1.5 may prevent patterns.</p></div>`,

  code: `<div class="code-section"><h3>Diffusion Ratio Effects</h3>
<pre><code class="language-js">// Turing instability requires Du/Dv ≥ ~2 (differential diffusion)
const LOW_RATIO  = { f: 0.055, k: 0.062, Du: 0.10,   Dv: 0.08,  dt: 1.0 }
const STD_RATIO  = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }
const HIGH_RATIO = { f: 0.055, k: 0.062, Du: 0.40,   Dv: 0.105, dt: 1.0 }

// If Du ≈ Dv, perturbations diffuse away symmetrically — no instability
// If Du >> Dv, U escapes while V is trapped — concentration amplifies
</code></pre></div>`,

  init(container, state) {
    let animationId = null
    let paused = false
    let step = 0
    const N = 200

    // Three different Du/Dv ratios
    const simulations = [
      {
        name: 'Du/Dv≈1.25: no patterns',
        params: { f: 0.055, k: 0.062, Du: 0.10, Dv: 0.08, dt: 1.0 },
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N)
      },
      {
        name: 'Du/Dv=2.0: patterns form',
        params: { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 },
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N)
      },
      {
        name: 'Du/Dv≈3.8: strong patterns',
        params: { f: 0.055, k: 0.062, Du: 0.40, Dv: 0.105, dt: 1.0 },
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N)
      }
    ]

    // Center patch seed for all
    function seedCenter(u, v, N) {
      for (let i = 95; i < 105; i++) {
        u[i] = 0.0; v[i] = 1.0
      }
    }

    simulations.forEach(sim => seedCenter(sim.u, sim.v, N))

    // Euler step function
    function eulerStep(u, v, uNew, vNew, N, p) {
      const { f, k, Du, Dv, dt } = p
      for (let i = 0; i < N; i++) {
        const l = (i - 1 + N) % N, r = (i + 1) % N  // periodic
        const lapU = u[l] - 2*u[i] + u[r]
        const lapV = v[l] - 2*v[i] + v[r]
        const uvv = u[i] * v[i] * v[i]
        uNew[i] = u[i] + dt * (Du * lapU - uvv + f * (1 - u[i]))
        vNew[i] = v[i] + dt * (Dv * lapV + uvv - (f + k) * v[i])
        uNew[i] = Math.max(0, Math.min(1, uNew[i]))
        vNew[i] = Math.max(0, Math.min(1, vNew[i]))
      }
    }

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', 500)
      .attr('height', 420)
      .style('display', 'block')
      .style('margin', '0 auto')

    // Create scales
    const xScale = d3.scaleLinear().domain([0, N-1]).range([50, 450])
    const yScale = d3.scaleLinear().domain([0, 1]).range([100, 20])

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))

    // Create panel groups
    const panels = svg.selectAll('.panel')
      .data(simulations)
      .enter()
      .append('g')
      .attr('class', 'panel')
      .attr('transform', (d, i) => `translate(0, ${i * 140})`)

    // Add panel titles
    panels.append('text')
      .attr('x', 250)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.name)

    // Add axes for each panel
    panels.each(function(d, i) {
      const panel = d3.select(this)

      // X axis
      panel.append('g')
        .attr('transform', 'translate(0, 100)')
        .call(d3.axisBottom(xScale).ticks(5))
        .selectAll('text')
        .style('font-family', 'SF Mono, monospace')
        .style('font-size', '8px')

      // Y axis
      panel.append('g')
        .attr('transform', 'translate(50, 0)')
        .call(d3.axisLeft(yScale).ticks(3))
        .selectAll('text')
        .style('font-family', 'SF Mono, monospace')
        .style('font-size', '8px')
    })

    // Add line paths
    const uPaths = panels.append('path')
      .attr('class', 'u-line')
      .attr('fill', 'none')
      .attr('stroke', '#2c2c2c')
      .attr('stroke-width', 1)

    const vPaths = panels.append('path')
      .attr('class', 'v-line')
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-width', 1)

    // Animation loop
    function animate() {
      if (!paused) {
        // Run 8 steps per frame
        for (let s = 0; s < 8; s++) {
          simulations.forEach(sim => {
            eulerStep(sim.u, sim.v, sim.uNew, sim.vNew, N, sim.params)
            // Swap buffers
            ;[sim.u, sim.uNew] = [sim.uNew, sim.u]
            ;[sim.v, sim.vNew] = [sim.vNew, sim.v]
          })
        }

        // Update visualization
        uPaths.datum(d => Array.from(d.u))
          .attr('d', line)

        vPaths.datum(d => Array.from(d.v))
          .attr('d', line)

        step += 8
      }

      animationId = requestAnimationFrame(animate)
    }

    // Create controls
    const controls = createSimControls(container, {
      onPause: (isPaused) => { paused = isPaused },
      onReplay: () => {
        step = 0
        simulations.forEach(sim => {
          sim.u.fill(1.0)
          sim.v.fill(0.0)
          seedCenter(sim.u, sim.v, N)
        })
      }
    })

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      controls.remove()
      container.innerHTML = ''
    }
  }
}
