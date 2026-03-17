/**
 * Step 79: Mass Conservation Check
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Mass Conservation Check',
  chapter: 7,

  math: `<div class="math-section"><h3>Mass Conservation</h3>
<p>The total concentration $\\sum(U+V)$ should decrease monotonically:
feed adds U, kill removes V, but net flux is slightly negative.
NaN or sudden jumps indicate numerical instability.</p>
<p>Expected behavior: Start near 1.0, drift down slowly to equilibrium.</p></div>`,

  code: `<div class="code-section"><h3>Mass Tracking</h3>
<pre><code class="language-js">// Compute total mass at each timestep
function computeTotalMass(u, v, N) {
  let sum = 0
  for (let i = 0; i < N; i++) {
    sum += u[i] + v[i]
  }
  return sum / N  // Average mass per cell
}

// Track over time
const massHistory = []
for (let t = 0; t < maxSteps; t++) {
  step1D(u, v, params)
  if (t % 5 === 0) {  // Sample every 5 steps
    massHistory.push([t, computeTotalMass(u, v, N)])
  }
}
</code></pre></div>`,

  init(container, state) {
    const S = 512
    const margin = { top: 20, right: 40, bottom: 60, left: 60 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 500]).range([0, W])
    const y = d3.scaleLinear().domain([0.9, 1.0]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.3f')))

    // Axis labels
    g.append('text')
      .attr('x', W/2).attr('y', H + 50)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('Time Steps')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -H/2).attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('Mean(U + V)')

    // Reference line at initial mass
    g.append('line')
      .attr('x1', 0).attr('x2', W)
      .attr('y1', y(1.0)).attr('y2', y(1.0))
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-width', 1)

    g.append('text')
      .attr('x', W - 80).attr('y', y(1.0) - 5)
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '9pt')
      .style('fill', '#666')
      .text('Initial mass')

    // Create path element
    const massPath = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)

    // 1D simulation setup
    const N = 256
    let u = new Float32Array(N).fill(1)
    let v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N)
    let v2 = new Float32Array(N)

    // Initialize with center spot
    const m = Math.floor(N/2)
    for (let i = m-8; i <= m+8; i++) {
      u[i] = 0.1; v[i] = 0.9
    }

    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0, N }
    let t = 0, animId, paused = false
    const massHistory = []

    function computeTotalMass() {
      let sum = 0
      for (let i = 0; i < N; i++) {
        sum += u[i] + v[i]
      }
      return sum / N
    }

    function reset() {
      u.fill(1); v.fill(0)
      for (let i = m-8; i <= m+8; i++) {
        u[i] = 0.1; v[i] = 0.9
      }
      t = 0
      massHistory.length = 0
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function step1D() {
      for (let i = 0; i < N; i++) {
        const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
        const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
        const lapU = ul - 2*u[i] + ur
        const lapV = vl - 2*v[i] + vr
        const uvv = u[i] * v[i] * v[i]

        u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
        v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
      }
      ;[u, u2] = [u2, u]; [v, v2] = [v2, v]
      t++
    }

    function animate() {
      animId = requestAnimationFrame(animate)

      if (!paused && t < 500) {
        step1D()

        // Sample mass every 5 steps
        if (t % 5 === 0) {
          const totalMass = computeTotalMass()
          massHistory.push([t, totalMass])

          // Keep only recent history
          if (massHistory.length > 100) {
            massHistory.shift()
          }
        }
      }

      // Render mass history
      if (massHistory.length > 1) {
        massPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(massHistory))
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.remove()
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
