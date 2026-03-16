/**
 * Step 71: Stability Analysis: CFL Condition
 */


export default {
  title: 'Stability Analysis: CFL Condition',
  chapter: 7,

  math: `<div class="math-section"><h3>CFL Stability Condition</h3>
<p>The Courant-Friedrichs-Lewy condition for the diffusion equation:</p>
<div class="math-block">$$\Delta t \leq \frac{h^2}{2D_{\max}} \quad \text{(1D)}$$</div>
<div class="math-block">$$\Delta t \leq \frac{h^2}{4D_{\max}} \quad \text{(2D)}$$</div>
<p>With h=1, Du=0.2097: dt ≤ 2.38 (1D) or dt ≤ 1.19 (2D). Use dt=1.0 for safety.</p></div>`,

  code: `<div class="code-section"><h3>Step 71 Code</h3>
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
    // CFL stability condition for explicit Euler on diffusion equation
    // Stability number r = D * dt / h²
    // Stable when r ≤ 0.5 (1D) or r ≤ 0.25 (2D)
    // With h=1 (one grid cell = one unit):
    //   r = Du * dt
    //   For Du = 0.2097: stable when dt ≤ 0.5/0.2097 ≈ 2.38
    //   We use dt = 1.0 → r = 0.2097 (well within stable range)

    function stabilityNumber(Du, dt, h = 1) {
      return Du * dt / (h * h)
    }

    // Check: stabilityNumber(0.2097, 1.0) = 0.2097 < 0.5 ✓
    // Check: stabilityNumber(0.2097, 2.5) = 0.524 > 0.5 ✗ (unstable)

    import('d3').then(d3 => {
      const width = 480, height = 320
      const margin = { top: 20, right: 40, bottom: 50, left: 60 }

      const svg = d3.select(container)
        .append('svg')
        .attr('id', 'd3-sim')
        .attr('width', width)
        .attr('height', height)

      const Du = 0.2097
      const dtMax = 3.0
      const dtStable = 0.5 / Du  // ≈ 2.38
      const dtUsed = 1.0

      // Generate data points
      const data = []
      for (let dt = 0.1; dt <= dtMax; dt += 0.05) {
        data.push({ dt, r: stabilityNumber(Du, dt) })
      }

      const xScale = d3.scaleLinear()
        .domain([0, dtMax])
        .range([margin.left, width - margin.right])

      const yScale = d3.scaleLinear()
        .domain([0, 0.8])
        .range([height - margin.bottom, margin.top])

      // Fill stable region (below r = 0.5)
      const area = d3.area()
        .x(d => xScale(d.dt))
        .y0(height - margin.bottom)
        .y1(d => yScale(Math.min(d.r, 0.5)))

      svg.append('path')
        .datum(data)
        .attr('fill', '#f0f0f0')
        .attr('d', area)

      // Plot the curve r = Du * dt
      const line = d3.line()
        .x(d => xScale(d.dt))
        .y(d => yScale(d.r))

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 2)
        .attr('d', line)

      // Stability limit r = 0.5 (red horizontal line)
      svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(0.5))
        .attr('y2', yScale(0.5))
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2)

      // Our dt = 1.0 (vertical dashed line)
      svg.append('line')
        .attr('x1', xScale(dtUsed))
        .attr('x2', xScale(dtUsed))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#059669')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')

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
        .text('Time step dt')

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Stability number r = Du⋅dt/h²')

      // Annotations
      svg.append('text')
        .attr('x', xScale(dtStable) + 10)
        .attr('y', yScale(0.45))
        .attr('font-size', '11px')
        .attr('fill', '#dc2626')
        .text(`stable: dt ≤ ${dtStable.toFixed(2)}`)

      svg.append('text')
        .attr('x', xScale(dtUsed) + 10)
        .attr('y', yScale(0.35))
        .attr('font-size', '11px')
        .attr('fill', '#059669')
        .text(`our dt=${dtUsed}`)
    })

    return () => { container.innerHTML = '' }
  }
}
