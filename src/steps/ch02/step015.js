/**
 * Step 15: 1D Traveling Waves and Standing Patterns
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: '1D Traveling Waves and Standing Patterns',
  chapter: 2,

  math: `<div class="math-section"><h3>1D Patterns</h3><p>In 1D, Gray-Scott produces traveling wave pulses and stationary patterns.
The specific dynamics depend on (f,k) and the 1D geometry — no spots or stripes form in 1D,
but the underlying chemistry is identical.</p></div>`,

  code: `<div class="code-section"><h3>Traveling Waves Code</h3>
<pre><code class="language-js">// Traveling wave: seed at left edge propagates rightward
function seedEdge(u, v, N) {
  u.fill(1.0); v.fill(0.0)
  for (let i = 0; i < 5; i++) { u[i] = 0.0; v[i] = 1.0 }
}

// After ~5000 steps, a wave front propagates across the domain
// Wave speed ≈ 2√(Du·f) — depends on diffusion and feed rate
</code></pre></div>`,

  init(container, state) {
    let animationId = null
    let paused = false
    let step = 0
    const N = 200
    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }

    // Initialize three simulations with different seeds
    const simulations = [
      {
        name: 'Center Patch',
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N),
        seed: (u, v) => {
          // Center patch seed
          for (let i = 95; i < 105; i++) {
            u[i] = 0.0; v[i] = 1.0
          }
        }
      },
      {
        name: 'Random Seed',
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N),
        seed: (u, v) => {
          // Random seed: 2% of cells get V=0.5 + noise
          for (let i = 0; i < N; i++) {
            if (Math.random() < 0.02) {
              u[i] = 0.5; v[i] = 0.5 + Math.random() * 0.5
            }
          }
        }
      },
      {
        name: 'Left Edge',
        u: new Float32Array(N).fill(1.0),
        v: new Float32Array(N).fill(0.0),
        uNew: new Float32Array(N),
        vNew: new Float32Array(N),
        seed: (u, v) => {
          // Left edge seed
          for (let i = 0; i < 5; i++) {
            u[i] = 0.0; v[i] = 1.0
          }
        }
      }
    ]

    // Initialize seeds
    simulations.forEach(sim => sim.seed(sim.u, sim.v))

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
            eulerStep(sim.u, sim.v, sim.uNew, sim.vNew, N, params)
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
          sim.seed(sim.u, sim.v)
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
