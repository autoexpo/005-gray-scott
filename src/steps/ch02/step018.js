/**
 * Step 18: Periodic vs Fixed Boundary Conditions in 1D
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Periodic vs Fixed Boundary Conditions in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Boundary Conditions</h3>
<p><strong>Periodic:</strong> cell 0 neighbours cell N-1. Domain acts as a torus. No edge effects.</p>
<p><strong>Dirichlet:</strong> u=1, v=0 at boundaries (absorbing). Waves reflect differently.</p>
<p><strong>Neumann:</strong> zero flux at boundaries. ∂u/∂n = 0 → reflective walls.</p></div>`,

  code: `<div class="code-section"><h3>Neumann Boundary Conditions</h3>
<pre><code class="language-js">function eulerStepNeumann(u, v, u2, v2, N, params) {
  const { f, k, Du, Dv, dt } = params

  for (let i = 0; i < N; i++) {
    let lapU, lapV

    if (i === 0) {
      // Left boundary: zero-flux (Neumann)
      lapU = u[1] - u[0]  // ∂u/∂x = 0 at left edge
      lapV = v[1] - v[0]
    } else if (i === N-1) {
      // Right boundary: zero-flux (Neumann)
      lapU = u[N-2] - u[N-1]  // ∂u/∂x = 0 at right edge
      lapV = v[N-2] - v[N-1]
    } else {
      // Interior: standard centered difference
      lapU = u[i-1] - 2*u[i] + u[i+1]
      lapV = v[i-1] - 2*v[i] + v[i+1]
    }

    const uvv = u[i] * v[i] * v[i]
    u2[i] = Math.max(0, Math.min(1, u[i] + dt*(Du*lapU - uvv + f*(1-u[i]))))
    v2[i] = Math.max(0, Math.min(1, v[i] + dt*(Dv*lapV + uvv - (f+k)*v[i])))
  }
}
</code></pre></div>`,

  init(container) {
    const totalW = 640, totalH = 260
    const panelW = 300, panelH = 200
    const margin = { top: 20, right: 20, bottom: 50, left: 20 }

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', totalW).attr('height', totalH)
      .style('display', 'block').style('margin', '20px auto 0')

    // Create two panels: Periodic vs Neumann
    const panels = []
    const boundaryTypes = ['Periodic', 'Neumann (zero-flux)']

    boundaryTypes.forEach((bcType, idx) => {
      const xOffset = idx * (panelW + 20) + margin.left
      const g = svg.append('g').attr('transform', `translate(${xOffset},${margin.top})`)

      const x = d3.scaleLinear().domain([0, 1]).range([0, panelW])
      const y = d3.scaleLinear().domain([0, 1]).range([panelH, 0])

      // Axes
      g.append('g').attr('transform', `translate(0,${panelH})`).call(d3.axisBottom(x).ticks(5))
      g.append('g').call(d3.axisLeft(y).ticks(5))

      // Style axes
      g.selectAll('.domain, .tick line').attr('stroke', '#000')
      g.selectAll('.tick text').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666')

      const uPath = g.append('path').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1.5)
      const vPath = g.append('path').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 1)

      const label = g.append('text')
        .attr('x', panelW/2).attr('y', panelH + 40)
        .attr('text-anchor', 'middle')
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '9pt')
        .attr('fill', '#666')
        .text(bcType)

      panels.push({ g, x, y, uPath, vPath, label })
    })

    // Simulation setup
    const N = 200
    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }

    // Two simulations: periodic and Neumann
    const sims = [
      {
        ...params,
        u: new Float32Array(N).fill(1),
        v: new Float32Array(N).fill(0),
        u2: new Float32Array(N),
        v2: new Float32Array(N),
        type: 'periodic',
        t: 0
      },
      {
        ...params,
        u: new Float32Array(N).fill(1),
        v: new Float32Array(N).fill(0),
        u2: new Float32Array(N),
        v2: new Float32Array(N),
        type: 'neumann',
        t: 0
      }
    ]

    // Seed both simulations
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

    function eulerStepPeriodic(sim) {
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

    function eulerStepNeumann(sim) {
      const { u, v, u2, v2, f, k, Du, Dv, dt } = sim
      for (let i = 0; i < N; i++) {
        let lapU, lapV

        if (i === 0) {
          // Left boundary: zero-flux (Neumann)
          lapU = u[1] - u[0]  // ∂u/∂x = 0 at left edge
          lapV = v[1] - v[0]
        } else if (i === N-1) {
          // Right boundary: zero-flux (Neumann)
          lapU = u[N-2] - u[N-1]  // ∂u/∂x = 0 at right edge
          lapV = v[N-2] - v[N-1]
        } else {
          // Interior: standard centered difference
          lapU = u[i-1] - 2*u[i] + u[i+1]
          lapV = v[i-1] - 2*v[i] + v[i+1]
        }

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
        const vData = Array.from(sim.v).map((val, i) => [i / (N-1), val])

        panel.uPath.attr('d', d3.line().x(d => panel.x(d[0])).y(d => panel.y(d[1]))(uData))
        panel.vPath.attr('d', d3.line().x(d => panel.x(d[0])).y(d => panel.y(d[1]))(vData))
      })
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        for (let s = 0; s < 4; s++) {
          eulerStepPeriodic(sims[0])
          eulerStepNeumann(sims[1])
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
