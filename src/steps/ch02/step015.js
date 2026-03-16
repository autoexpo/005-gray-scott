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

  code: `<div class="code-section"><h3>1D Euler Step Function</h3>
<pre><code class="language-js">function eulerStep1D(u, v, u2, v2, N, params) {
  const { f, k, Du, Dv, dt } = params

  for (let i = 0; i < N; i++) {
    // Periodic boundary conditions
    const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
    const vl = v[(i-1+N)%N], vr = v[(i+1)%N]

    // 1D Laplacian
    const lapU = ul - 2*u[i] + ur
    const lapV = vl - 2*v[i] + vr

    // Gray-Scott reaction term
    const uvv = u[i] * v[i] * v[i]

    // Euler integration with clamping
    u2[i] = Math.max(0, Math.min(1,
      u[i] + dt * (Du*lapU - uvv + f*(1-u[i]))
    ))
    v2[i] = Math.max(0, Math.min(1,
      v[i] + dt * (Dv*lapV + uvv - (f+k)*v[i])
    ))
  }

  // Swap front/back buffers
  ;[u,u2] = [u2,u]; [v,v2] = [v2,v]
}
</code></pre></div>`,

  init(container) {
    const S = 512
    const margin = { top: 20, right: 20, bottom: 50, left: 50 }
    const W = S - margin.left - margin.right
    const H = 400 - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', 400)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 1]).range([0, W])
    const y = d3.scaleLinear().domain([0, 1]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(5))

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', '#000')
    g.selectAll('.tick text').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666')

    // Create path elements for U and V lines
    const uPath = g.append('path').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1.5)
    const vPath = g.append('path').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 1)

    // Parameter and time label
    const infoLabel = g.append('text')
      .attr('x', 0).attr('y', H + 40)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '9pt')
      .attr('fill', '#666')

    // 1D Gray-Scott simulation setup
    const N = 200
    let u = new Float32Array(N).fill(1)
    let v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N)
    let v2 = new Float32Array(N)

    // Seed center 12 cells with u=0, v=1 (traveling pulse will emerge)
    for (let i = 94; i <= 106; i++) { u[i] = 0; v[i] = 1 }

    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }
    let t = 0, animId, paused = false

    function reset() {
      u.fill(1); v.fill(0)
      for (let i = 94; i <= 106; i++) { u[i] = 0; v[i] = 1 }
      t = 0
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function eulerStep1D() {
      for (let i = 0; i < N; i++) {
        const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
        const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
        const lapU = ul - 2*u[i] + ur, lapV = vl - 2*v[i] + vr
        const uvv = u[i] * v[i] * v[i]
        u2[i] = Math.max(0, Math.min(1, u[i] + params.dt * (params.Du*lapU - uvv + params.f*(1-u[i]))))
        v2[i] = Math.max(0, Math.min(1, v[i] + params.dt * (params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
      }
      ;[u,u2] = [u2,u]; [v,v2] = [v2,v]
      t++
    }

    function render() {
      const uData = Array.from(u).map((val, i) => [i / (N-1), val])
      const vData = Array.from(v).map((val, i) => [i / (N-1), val])

      uPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(uData))
      vPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(vData))

      infoLabel.text(`t=${t}  f=${params.f} k=${params.k}`)
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        for (let s = 0; s < 4; s++) eulerStep1D()
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
