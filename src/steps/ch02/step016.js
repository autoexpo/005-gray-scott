/**
 * Step 16: Effect of Changing f in 1D
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Effect of Changing f in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Effect of Feed Rate f</h3>
<p>Increasing f speeds up U replenishment. Effect on patterns:</p>
<ul style="margin-left:16px;line-height:1.9">
<li>f too small → V starves, patterns die</li>
<li>f optimal → stable traveling pulses or standing waves</li>
<li>f too large → V grows unchecked, uniform coverage</li>
</ul></div>`,

  code: `<div class="code-section"><h3>Multi-Panel f Comparison</h3>
<pre><code class="language-js">// Three simultaneous simulations with different f values
const fValues = [0.020, 0.055, 0.090]
const sims = fValues.map(f => ({
  f, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0,
  u: new Float32Array(N).fill(1),
  v: new Float32Array(N).fill(0),
  u2: new Float32Array(N),
  v2: new Float32Array(N),
  t: 0
}))

// Seed each simulation
sims.forEach(sim => {
  for (let i = 94; i <= 106; i++) {
    sim.u[i] = 0; sim.v[i] = 1
  }
})

// Run all three simulations per frame
function stepAll() {
  sims.forEach(sim => eulerStep1D(sim))
}
</code></pre></div>`,

  init(container) {
    const totalW = 640, totalH = 220
    const panelW = 200, panelH = 140
    const margin = { top: 20, right: 10, bottom: 40, left: 10 }

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', totalW).attr('height', totalH)
      .style('display', 'block').style('margin', '20px auto 0')

    // Create three panels
    const panels = []
    const fValues = [0.020, 0.055, 0.090]
    const fLabels = ['V dies', 'stable pulses', 'V fills uniformly']

    fValues.forEach((f, idx) => {
      const xOffset = idx * (panelW + 20) + margin.left
      const g = svg.append('g').attr('transform', `translate(${xOffset},${margin.top})`)

      const x = d3.scaleLinear().domain([0, 1]).range([0, panelW])
      const y = d3.scaleLinear().domain([0, 1]).range([panelH, 0])

      // Simple axes
      g.append('line').attr('x1', 0).attr('x2', panelW).attr('y1', panelH).attr('y2', panelH)
        .attr('stroke', '#000').attr('stroke-width', 1)
      g.append('line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', panelH)
        .attr('stroke', '#000').attr('stroke-width', 1)

      const uPath = g.append('path').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1.5)

      const label = g.append('text')
        .attr('x', panelW/2).attr('y', panelH + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '9pt')
        .attr('fill', '#666')
        .text(`f=${f} (${fLabels[idx]})`)

      panels.push({ g, x, y, uPath, label })
    })

    // Simulation setup
    const N = 200
    const sims = fValues.map(f => ({
      f, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0,
      u: new Float32Array(N).fill(1),
      v: new Float32Array(N).fill(0),
      u2: new Float32Array(N),
      v2: new Float32Array(N),
      t: 0
    }))

    // Seed each simulation
    sims.forEach(sim => {
      for (let i = 94; i <= 106; i++) {
        sim.u[i] = 0; sim.v[i] = 1
      }
    })

    let animId, paused = false

    function reset() {
      sims.forEach(sim => {
        sim.u.fill(1); sim.v.fill(0)
        for (let i = 94; i <= 106; i++) {
          sim.u[i] = 0; sim.v[i] = 1
        }
        sim.t = 0
      })
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function eulerStep1D(sim) {
      const { u, v, u2, v2, f, k, Du, Dv, dt } = sim
      for (let i = 0; i < N; i++) {
        const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
        const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
        const lapU = ul - 2*u[i] + ur, lapV = vl - 2*v[i] + vr
        const uvv = u[i] * v[i] * v[i]
        u2[i] = Math.max(0, Math.min(1, u[i] + dt * (Du*lapU - uvv + f*(1-u[i]))))
        v2[i] = Math.max(0, Math.min(1, v[i] + dt * (Dv*lapV + uvv - (f+k)*v[i])))
      }
      ;[sim.u, sim.u2] = [sim.u2, sim.u]; [sim.v, sim.v2] = [sim.v2, sim.v]
      sim.t++
    }

    function render() {
      sims.forEach((sim, idx) => {
        const panel = panels[idx]
        const uData = Array.from(sim.u).map((val, i) => [i / (N-1), val])
        panel.uPath.attr('d', d3.line().x(d => panel.x(d[0])).y(d => panel.y(d[1]))(uData))
      })
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        for (let s = 0; s < 4; s++) {
          sims.forEach(sim => eulerStep1D(sim))
        }
      }
      render()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.remove()
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
