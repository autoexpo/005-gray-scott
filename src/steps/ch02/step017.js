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

  code: `<div class="code-section"><h3>Du/Dv Parameter Variations</h3>
<pre><code class="language-js">// Three diffusion coefficient pairs, maintaining 2:1 ratio
const diffusionSets = [
  { Du: 0.08, Dv: 0.04, label: 'slow diffusion' },
  { Du: 0.2097, Dv: 0.105, label: 'standard' },
  { Du: 0.40, Dv: 0.20, label: 'high diffusion' }
]

// Same f, k for all panels to isolate Du/Dv effects
const baseParams = { f: 0.055, k: 0.062, dt: 1.0 }

const sims = diffusionSets.map(({Du, Dv, label}) => ({
  ...baseParams, Du, Dv, label,
  u: new Float32Array(N).fill(1),
  v: new Float32Array(N).fill(0),
  u2: new Float32Array(N),
  v2: new Float32Array(N)
}))
</code></pre></div>`,

  init(container) {
    const totalW = 640, totalH = 220
    const panelW = 200, panelH = 140
    const margin = { top: 20, right: 10, bottom: 40, left: 10 }

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', totalW).attr('height', totalH)
      .style('display', 'block').style('margin', '20px auto 0')

    // Create three panels with different Du/Dv values
    const panels = []
    const diffusionSets = [
      { Du: 0.08, Dv: 0.04, label: 'slow diffusion' },
      { Du: 0.2097, Dv: 0.105, label: 'standard' },
      { Du: 0.40, Dv: 0.20, label: 'high diffusion' }
    ]

    diffusionSets.forEach((set, idx) => {
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
        .text(`Du=${set.Du} Dv=${set.Dv}`)

      panels.push({ g, x, y, uPath, label })
    })

    // Simulation setup
    const N = 200
    const sims = diffusionSets.map(({Du, Dv, label}) => ({
      f: 0.055, k: 0.062, Du, Dv, dt: 1.0, label,
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
