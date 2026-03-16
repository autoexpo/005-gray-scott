/**
 * Step 88: Pattern Wavelength: Dispersion Relation
 */


export default {
  title: 'Pattern Wavelength: Dispersion Relation',
  chapter: 8,

  math: `<div class="math-section"><h3>Dispersion Relation</h3>
<p>The dispersion relation $\\sigma(q^2)$ is a polynomial whose roots give the growth rates.
The wavenumber $q^*$ that grows fastest determines the pattern wavelength:</p>
<div class="math-block">$$\\lambda^* = \\frac{2\\pi}{q^*}$$</div></div>`,

  code: `<div class="code-section"><h3>Step 88 Code</h3>
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
    // Find dominant wavenumber q* that maximizes growth rate
    function dominantWavelength(params) {
      const u0 = 0.5, v0 = 0.25
      let maxRate = -Infinity, bestQ2 = 0
      for (let q2 = 0.01; q2 < 20; q2 += 0.05) {
        const rate = growthRate(q2, u0, v0, params)
        if (rate > maxRate) { maxRate = rate; bestQ2 = q2 }
      }
      return bestQ2 > 0 ? 2 * Math.PI / Math.sqrt(bestQ2) : Infinity
    }
    // Larger λ → larger spots/stripes
    // Smaller λ → finer-grained patterns

    function growthRate(q2, u0, v0, params) {
      const { f, k, Du, Dv } = params
      const a = -2*u0*v0 - f - Du*q2
      const b = -u0*u0
      const c = 2*u0*v0
      const d = u0*u0 - (f+k) - Dv*q2
      const tr = a + d
      const det = a*d - b*c
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

      // Generate data: wavelength vs feed rate
      const data = []
      for (let f = 0.02; f <= 0.08; f += 0.002) {
        const params = { f, k: 0.065, Du: 0.2097, Dv: 0.105 }
        const lambda = dominantWavelength(params)
        if (lambda !== Infinity && lambda < 100) {  // Filter out invalid/huge values
          data.push({ f, lambda })
        }
      }

      const xScale = d3.scaleLinear()
        .domain([0.02, 0.08])
        .range([margin.left, width - margin.right])

      const yScale = d3.scaleLinear()
        .domain([10, 50])
        .range([height - margin.bottom, margin.top])

      // Plot the wavelength curve
      const line = d3.line()
        .x(d => xScale(d.f))
        .y(d => yScale(d.lambda))

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 2)
        .attr('d', line)

      // Add data points
      svg.selectAll('.data-point')
        .data(data.filter((_, i) => i % 5 === 0))  // Subsample for clarity
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => xScale(d.f))
        .attr('cy', d => yScale(d.lambda))
        .attr('r', 3)
        .attr('fill', '#2563eb')

      // Axes
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d.toFixed(3)))

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))

      // Labels
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Feed rate f')

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Pattern wavelength λ*')

      // Annotation
      svg.append('text')
        .attr('x', xScale(0.055))
        .attr('y', yScale(45))
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text('Increasing f → finer patterns')
    })

    return () => { container.innerHTML = '' }
  }
}
