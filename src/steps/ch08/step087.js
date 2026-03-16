/**
 * Step 87: Turing Instability Analysis: Linearization
 */


export default {
  title: 'Turing Instability Analysis: Linearization',
  chapter: 8,

  math: `<div class="math-section"><h3>Turing Instability: Linear Analysis</h3>
<p>Linearize around the homogeneous steady state $(u^*, v^*)$. Write $u = u^* + \\tilde{u}\\,e^{iqx+\\sigma t}$.
The growth rate $\\sigma(q)$ determines which wavenumbers $q$ are unstable.
Instability occurs when $\\text{Re}(\\sigma) > 0$ for some $q \\neq 0$.</p></div>`,

  code: `<div class="code-section"><h3>Step 87 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,

  init(container, state) {
    // Turing instability: linearization around homogeneous steady state
    // Steady state (u0, v0) satisfies: f(1-u0) = u0*v0², (f+k)*v0 = u0*v0²
    // Jacobian of reaction terms:
    // J = [[-2*u0*v0 - f,  -u0²    ],
    //      [+2*u0*v0,       u0² - (f+k)]]
    //
    // At wavenumber q, effective matrix:
    // M(q²) = J - q²·diag(Du, Dv)
    //
    // Turing instability condition: det(M) < 0 for some q² > 0
    // while trace(M) < 0 (stable in time, unstable in space)

    function growthRate(q2, u0, v0, params) {
      const { f, k, Du, Dv } = params
      const a = -2*u0*v0 - f - Du*q2
      const b = -u0*u0
      const c = 2*u0*v0
      const d = u0*u0 - (f+k) - Dv*q2
      const tr = a + d
      const det = a*d - b*c
      // Max eigenvalue real part:
      return tr/2 + Math.sqrt(Math.max(0, (tr/2)**2 - det))
    }

    import('d3').then(d3 => {
      const width = 480, height = 300
      const margin = { top: 20, right: 40, bottom: 50, left: 60 }

      const svg = d3.select(container)
        .append('svg')
        .attr('id', 'd3-sim')
        .attr('width', width)
        .attr('height', height)

      // Use approximate steady state and standard parameters
      const u0 = 0.5, v0 = 0.25
      const params = { f: 0.035, k: 0.065, Du: 0.2097, Dv: 0.105 }

      // Generate data points
      const data = []
      const maxQ2 = 10
      for (let q2 = 0; q2 <= maxQ2; q2 += 0.1) {
        const sigma = growthRate(q2, u0, v0, params)
        data.push({ q2, sigma })
      }

      const xScale = d3.scaleLinear()
        .domain([0, maxQ2])
        .range([margin.left, width - margin.right])

      const yScale = d3.scaleLinear()
        .domain([-0.05, 0.02])
        .range([height - margin.bottom, margin.top])

      // Fill unstable region (σ > 0)
      const unstableData = data.filter(d => d.sigma > 0)
      if (unstableData.length > 0) {
        const area = d3.area()
          .x(d => xScale(d.q2))
          .y0(yScale(0))
          .y1(d => yScale(d.sigma))

        svg.append('path')
          .datum(unstableData)
          .attr('fill', '#e5e5e5')
          .attr('d', area)
      }

      // Plot the dispersion curve σ(q²)
      const line = d3.line()
        .x(d => xScale(d.q2))
        .y(d => yScale(d.sigma))

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 2)
        .attr('d', line)

      // Zero line
      svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')

      // Axes
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))

      // Labels
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Wavenumber squared k²')

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Growth rate σ')

      // Annotation for unstable band
      const unstableQ2 = unstableData.map(d => d.q2)
      if (unstableQ2.length > 0) {
        const midQ2 = (unstableQ2[0] + unstableQ2[unstableQ2.length - 1]) / 2
        svg.append('text')
          .attr('x', xScale(midQ2))
          .attr('y', yScale(0.015))
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#666')
          .text('Turing unstable')
      }
    })

    return () => { container.innerHTML = '' }
  }
}
