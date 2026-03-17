/**
 * Step 80: Convergence Study
 */
import * as d3 from 'd3'

export default {
  title: 'Convergence Study',
  chapter: 7,

  math: `<div class="math-section"><h3>Convergence Study</h3>
<p>Halve grid spacing h, halve time step dt (to maintain CFL).
If the O(h²) convergence rate holds, the solution error should decrease as h².</p>
<p>Richardson extrapolation: Compare solutions at different resolutions.</p></div>`,

  code: `<div class="code-section"><h3>Grid Refinement Analysis</h3>
<pre><code class="language-js">// Run simulations at multiple resolutions
const gridSizes = [32, 64, 128, 256]
const errors = []

for (const N of gridSizes) {
  const h = 1.0 / N  // Grid spacing
  const solution = simulate1D(N, 100)  // 100 time steps

  // Compare with finest grid (interpolated)
  const reference = interpolate(solutionFinest, N)
  const error = l2Norm(subtract(solution, reference))

  errors.push({ h, error, N })
}

// Plot log(error) vs log(h) — slope should be ≈ 2
</code></pre></div>`,

  init(container, state) {
    const S = 512
    const margin = { top: 40, right: 40, bottom: 60, left: 80 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Compute convergence data (synchronously in init)
    const gridSizes = [32, 64, 128, 256]
    const results = []

    function simulate1D(N, steps) {
      let u = new Float32Array(N).fill(1)
      let v = new Float32Array(N).fill(0)
      let u2 = new Float32Array(N)
      let v2 = new Float32Array(N)

      // Center perturbation
      const m = Math.floor(N/2)
      const w = Math.max(2, Math.floor(N/32)) // Scale perturbation with N
      for (let i = m-w; i <= m+w; i++) {
        if (i >= 0 && i < N) { u[i] = 0.1; v[i] = 0.9 }
      }

      const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0, N }

      // Run simulation
      for (let t = 0; t < steps; t++) {
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
      }

      return { u: Array.from(u), v: Array.from(v) }
    }

    function interpolate(fine, coarseN) {
      const fineN = fine.u.length
      const ratio = fineN / coarseN
      const result = { u: new Array(coarseN), v: new Array(coarseN) }

      for (let i = 0; i < coarseN; i++) {
        const fineIndex = Math.floor(i * ratio)
        result.u[i] = fine.u[fineIndex]
        result.v[i] = fine.v[fineIndex]
      }
      return result
    }

    function l2Error(a, b) {
      let sum = 0
      for (let i = 0; i < a.u.length; i++) {
        sum += (a.u[i] - b.u[i])**2 + (a.v[i] - b.v[i])**2
      }
      return Math.sqrt(sum / a.u.length)
    }

    // Compute results for all grid sizes
    const solutions = gridSizes.map(N => ({ N, h: 1.0/N, sol: simulate1D(N, 100) }))
    const finestSol = solutions[solutions.length - 1].sol

    for (let i = 0; i < solutions.length - 1; i++) {
      const { N, h, sol } = solutions[i]
      const interp = interpolate(finestSol, N)
      const error = l2Error(sol, interp)
      results.push({ N, h, error: Math.max(error, 1e-6) }) // Avoid log(0)
    }

    // Set up log-log scales
    const hRange = d3.extent(results, d => d.h)
    const errorRange = d3.extent(results, d => d.error)

    const x = d3.scaleLog().domain(hRange).range([0, W])
    const y = d3.scaleLog().domain(errorRange).range([H, 0])

    // Draw axes
    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(3).tickFormat(d3.format('.3f')))
    g.append('g').call(d3.axisLeft(y).ticks(3).tickFormat(d3.format('.1e')))

    // Axis labels
    g.append('text')
      .attr('x', W/2).attr('y', H + 50)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('h = 1/N (Grid Spacing)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -H/2).attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('L2 Error')

    // Plot data points
    g.selectAll('.point')
      .data(results)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d.h))
      .attr('cy', d => y(d.error))
      .attr('r', 5)
      .attr('fill', '#2563eb')

    // Labels for points
    g.selectAll('.label')
      .data(results)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.h) + 8)
      .attr('y', d => y(d.error) + 3)
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '9pt')
      .style('fill', '#666')
      .text(d => `N=${d.N}`)

    // Reference line with slope 2 (h² convergence)
    if (results.length >= 2) {
      const h1 = results[0].h, h2 = results[results.length - 1].h
      const e1 = results[0].error
      const refSlope = 2  // O(h²)
      const refE2 = e1 * Math.pow(h2/h1, refSlope)

      g.append('line')
        .attr('x1', x(h1)).attr('y1', y(e1))
        .attr('x2', x(h2)).attr('y2', y(refE2))
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')

      g.append('text')
        .attr('x', x(h2) - 60).attr('y', y(refE2) - 10)
        .style('font-family', 'SF Mono, monospace')
        .style('font-size', '9pt')
        .style('fill', '#dc2626')
        .text('O(h²) reference')
    }

    // Title
    g.append('text')
      .attr('x', W/2).attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('font-weight', 'bold')
      .text('Grid Convergence: Log-Log Plot')

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
