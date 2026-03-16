/**
 * Step 71: Stability Analysis — CFL Condition
 */

import * as d3 from 'd3'

export default {
  title: 'Stability Analysis — CFL Condition',
  chapter: 7,

  math: `<div class="math-section"><h3>CFL Stability Condition</h3>
<p>The Courant-Friedrichs-Lewy condition ensures numerical stability for diffusion equations:</p>
<div class="math-block">$$\\Delta t \\leq \\frac{h^2}{2D_{\\max}} \\quad \\text{(1D)}$$</div>
<div class="math-block">$$\\Delta t \\leq \\frac{h^2}{4D_{\\max}} \\quad \\text{(2D)}$$</div>
<p>With grid spacing h=1 and Du=0.2097:</p>
<div class="math-block">$$\\Delta t_{\\max} = \\frac{1^2}{4 \\times 0.2097} \\approx 1.19 \\quad \\text{(2D)}$$</div>
<p>We use dt=1.0 for a safe margin. Beyond dt_max, high-frequency modes amplify exponentially, causing blow-up with NaN propagation through the Laplacian stencil.</p>
<p>The von Neumann stability analysis shows that the amplification factor for wavenumber q is:</p>
<div class="math-block">$$|G(q)| = |1 - 4D \\frac{\\Delta t}{h^2} \\sin^2(\\frac{q h}{2})|$$</div>
<p>Stability requires |G(q)| ≤ 1 for all q, which gives the CFL condition.</p></div>`,

  code: `<div class="code-section"><h3>CFL Stability Check</h3>
<pre><code class="language-js">// Check CFL stability before running simulation
function checkCFLCondition(params, gridSpacing = 1) {
  const { Du, Dv, dt } = params
  const Dmax = Math.max(Du, Dv)

  // 2D CFL limit
  const dtMax2D = (gridSpacing * gridSpacing) / (4 * Dmax)
  const dtMax1D = (gridSpacing * gridSpacing) / (2 * Dmax)

  console.log(\`CFL Analysis:\`)
  console.log(\`  Du = \${Du}, Dv = \${Dv}\`)
  console.log(\`  dt_max (1D) = \${dtMax1D.toFixed(3)}\`)
  console.log(\`  dt_max (2D) = \${dtMax2D.toFixed(3)}\`)
  console.log(\`  Current dt = \${dt}\`)
  console.log(\`  Stability: \${dt <= dtMax2D ? 'SAFE' : 'UNSTABLE'}\`)

  return dt <= dtMax2D
}

// Detect NaN propagation in simulation data
function checkForNaN(data) {
  let nanCount = 0
  for (let i = 0; i < data.length; i += 4) {
    if (!Number.isFinite(data[i]) || !Number.isFinite(data[i+1])) {
      nanCount++
    }
  }
  return nanCount
}</code></pre></div>`,

  init(container, state) {
    // Create D3 stability diagram
    const margin = { top: 40, right: 60, bottom: 60, left: 60 }
    const width = 400 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('margin', 'auto')
      .style('display', 'block')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 2.5])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, 1.5])
      .range([height, 0])

    // Calculate stability factor r = Du*dt/h²
    const Du = 0.2097
    const h = 1

    // Create stability regions
    const stableThreshold = 0.25 // r ≤ 0.25 for stability in 2D

    // Background regions
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(stableThreshold))
      .attr('width', width)
      .attr('height', height - yScale(stableThreshold))
      .attr('fill', '#f0f0f0')
      .attr('opacity', 0.5)

    g.append('text')
      .attr('x', width/2)
      .attr('y', yScale(0.8))
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Unstable Region')

    g.append('text')
      .attr('x', width/2)
      .attr('y', yScale(0.1))
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Stable Region')

    // Stability boundary line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(stableThreshold))
      .attr('y2', yScale(stableThreshold))
      .attr('stroke', '#d62728')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    // Current operating point (dt=1.0)
    const currentDt = 1.0
    const currentR = Du * currentDt / (h * h)

    g.append('circle')
      .attr('cx', xScale(currentDt))
      .attr('cy', yScale(currentR))
      .attr('r', 6)
      .attr('fill', '#2ca02c')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    g.append('text')
      .attr('x', xScale(currentDt) + 10)
      .attr('y', yScale(currentR) - 10)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('dt=1.0 (safe)')

    // CFL limit marker
    const dtMax = h*h / (4*Du)
    const rMax = Du * dtMax / (h * h)

    g.append('line')
      .attr('x1', xScale(dtMax))
      .attr('x2', xScale(dtMax))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ff7f0e')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')

    g.append('text')
      .attr('x', xScale(dtMax) + 5)
      .attr('y', 20)
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', '#ff7f0e')
      .text(`dt_max=${dtMax.toFixed(2)}`)

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(6)
    const yAxis = d3.axisLeft(yScale).ticks(6)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

    g.append('g')
      .call(yAxis)

    // Axis labels
    g.append('text')
      .attr('transform', `translate(${width/2}, ${height + 50})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Time Step (Δt)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Growth Factor (r = DuΔt/h²)')

    // Title
    g.append('text')
      .attr('x', width/2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('CFL Stability Diagram')

    return function cleanup() {
      container.innerHTML = ''
    }
  }
}