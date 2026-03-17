/**
 * Step 17: Effect of Changing Du and Dv in 1D
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Effect of Changing Du and Dv in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Diffusion Ratio Du/Dv</h3>
<p>The ratio Du/Dv is critical for Turing instability. Standard: Du=0.2097, Dv=0.105 (ratio 2:1).</p>
<p>Higher ratios create coarser patterns with wider spacing.</p>
<ul style="margin-left:16px;line-height:1.9">
<li>Du/Dv = 2:1 → standard fine patterns</li>
<li>Du/Dv = 4:1 → coarser, wider-spaced patterns</li>
</ul></div>`,

  code: `<div class="code-section"><h3>Two-Panel Comparison</h3>
<pre><code class="language-js">// Left panel: Du=0.2097, Dv=0.105 (ratio 2:1)
const scenario1 = { Du: 0.2097, Dv: 0.105, label: 'Du/Dv = 2:1' }

// Right panel: Du=0.2097, Dv=0.05 (ratio 4:1)
const scenario2 = { Du: 0.2097, Dv: 0.05, label: 'Du/Dv = 4:1' }

// Both animate simultaneously, showing different spacing
</code></pre></div>`,

  init(container, state) {
    const S = 512
    const margin = { top: 20, right: 20, bottom: 80, left: 50 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 1]).range([0, W])
    const y = d3.scaleLinear().domain([0, 2]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(2))

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', '#000')
    g.selectAll('.tick text').style('font-family', 'SF Mono, monospace').style('font-size', '9pt').attr('fill', '#666')

    // Create scenarios
    const N = 200
    const scenarios = [
      { Du: 0.2097, Dv: 0.105, label: 'Du/Dv = 2:1 (standard)', color: '#2563eb', yOffset: 0 },
      { Du: 0.2097, Dv: 0.05, label: 'Du/Dv = 4:1 (coarser)', color: '#dc2626', yOffset: 1 }
    ]

    // Initialize each scenario
    scenarios.forEach((scenario, idx) => {
      scenario.u = new Float32Array(N).fill(1)
      scenario.v = new Float32Array(N).fill(0)
      scenario.u2 = new Float32Array(N)
      scenario.v2 = new Float32Array(N)

      // Center spot initialization
      const m = Math.floor(N/2)
      for (let i = m-8; i <= m+8; i++) {
        scenario.u[i] = 0.1; scenario.v[i] = 0.9
      }

      scenario.params = { f: 0.055, k: 0.062, Du: scenario.Du, Dv: scenario.Dv, dt: 1.0, N }

      // Create path for this scenario
      scenario.path = g.append('path')
        .attr('fill', 'none')
        .attr('stroke', scenario.color)
        .attr('stroke-width', 1.5)

      // Add label
      g.append('text')
        .attr('x', 5)
        .attr('y', y(scenario.yOffset + 0.8))
        .style('font-family', 'SF Mono, monospace')
        .style('font-size', '9pt')
        .attr('fill', scenario.color)
        .text(scenario.label)
    })

    let t = 0, animId, paused = false

    function reset() {
      scenarios.forEach(scenario => {
        scenario.u.fill(1); scenario.v.fill(0)
        const m = Math.floor(N/2)
        for (let i = m-8; i <= m+8; i++) {
          scenario.u[i] = 0.1; scenario.v[i] = 0.9
        }
      })
      t = 0
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function step1D(scenario) {
      const { u, v, u2, v2, params } = scenario
      for (let i = 0; i < N; i++) {
        const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
        const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
        const lapU = ul - 2*u[i] + ur
        const lapV = vl - 2*v[i] + vr
        const uvv = u[i] * v[i] * v[i]

        u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
        v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
      }
      ;[scenario.u, scenario.u2] = [scenario.u2, scenario.u]
      ;[scenario.v, scenario.v2] = [scenario.v2, scenario.v]
    }

    function render() {
      scenarios.forEach(scenario => {
        const uData = Array.from(scenario.u).map((val, i) => [i / (N-1), val + scenario.yOffset])
        scenario.path.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(uData))
      })
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        scenarios.forEach(step1D)
        t++
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
