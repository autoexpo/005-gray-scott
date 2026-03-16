/**
 * Step 80: Convergence Study
 */
import * as d3 from 'd3'

export default {
  title: 'Convergence Study',
  chapter: 7,

  math: `<div class="math-section"><h3>Numerical Convergence Analysis</h3>
<p>Convergence study: run simulations at multiple resolutions and measure how the dominant spot wavelength λ converges:</p>
<div class="math-block">$$\\lambda_{\\text{theory}} \\propto \\sqrt{\\frac{D_u}{f}} \\quad \\text{(Turing wavelength)}$$</div>
<p><strong>Convergence test procedure</strong>:</p>
<ol>
<li>Run simulations at N = 32, 64, 128, 256 grid points</li>
<li>Measure dominant wavelength λ(N) from pattern analysis</li>
<li>Plot λ vs grid spacing h = 1/N</li>
<li>Expect λ to plateau at true value for large N</li>
</ol>
<p><strong>Convergence rate</strong>: For 5-point finite differences:</p>
<div class="math-block">$$E(h) = E_0 h^p + O(h^{p+1}) \\quad \\text{where } p \\approx 1$$</div>
<p><strong>Richardson extrapolation</strong>: Improve accuracy using two grid solutions:</p>
<div class="math-block">$$u_{\\text{exact}} \\approx u(h) + \\frac{u(h) - u(2h)}{2^p - 1}$$</div>
<p>For p = 1 (first-order): u_exact ≈ 2×u(h) - u(2h)</p>
<p><strong>Spatial frequency analysis</strong>: Use 2D FFT or autocorrelation to extract dominant wavelength</p></div>`,

  code: `<div class="code-section"><h3>Convergence Analysis Implementation</h3>
<pre><code class="language-js">// Richardson extrapolation for improved accuracy
function richardsonExtrapolation(u_fine, u_coarse, order = 1) {
  if (u_fine.length !== u_coarse.length * 4) {
    throw new Error('Fine grid must be 2x coarse grid in each dimension')
  }

  const factor = Math.pow(2, order)
  const u_extrapolated = new Float32Array(u_fine.length)

  // Interpolate coarse solution to fine grid
  const coarse_size = Math.sqrt(u_coarse.length)
  const fine_size = Math.sqrt(u_fine.length)

  for (let fy = 0; fy < fine_size; fy++) {
    for (let fx = 0; fx < fine_size; fx++) {
      const cy = Math.floor(fy / 2)
      const cx = Math.floor(fx / 2)
      const coarse_idx = cy * coarse_size + cx
      const fine_idx = fy * fine_size + fx

      const u_c = u_coarse[coarse_idx]
      const u_f = u_fine[fine_idx]

      // Richardson extrapolation: u_exact ≈ u_f + (u_f - u_c)/(2^p - 1)
      u_extrapolated[fine_idx] = u_f + (u_f - u_c) / (factor - 1)
    }
  }

  return u_extrapolated
}

// Measure dominant wavelength from autocorrelation
function measureWavelength(field, gridSize) {
  // Simplified autocorrelation-based wavelength estimation
  const autocorr = computeAutocorrelation(field, gridSize)
  const wavelength = findFirstMinimum(autocorr, gridSize)
  return wavelength * 2 // Convert radius to wavelength
}

function computeAutocorrelation(field, size) {
  const autocorr = new Float32Array(size / 2)

  for (let r = 1; r < size / 2; r++) {
    let sum = 0, count = 0

    for (let y = r; y < size - r; y++) {
      for (let x = r; x < size - r; x++) {
        const center = field[y * size + x]
        const neighbor = field[(y-r) * size + (x-r)]
        sum += center * neighbor
        count++
      }
    }

    autocorr[r] = sum / count
  }

  return autocorr
}

function findFirstMinimum(autocorr, size) {
  for (let r = 2; r < autocorr.length - 1; r++) {
    if (autocorr[r] < autocorr[r-1] && autocorr[r] < autocorr[r+1]) {
      return r
    }
  }
  return size / 4 // Default fallback
}

// Convergence study runner
async function runConvergenceStudy(params) {
  const gridSizes = [32, 64, 128, 256]
  const results = []

  for (const N of gridSizes) {
    console.log(\`Running convergence test at \${N}×\${N}...\`)

    const field = await runSimulation(params, N, 5000) // 5000 steps
    const wavelength = measureWavelength(field, N)
    const gridSpacing = 1 / N

    results.push({
      N: N,
      gridSpacing: gridSpacing,
      wavelength: wavelength,
      normalizedWavelength: wavelength / N, // Wavelength in grid units
      relativeError: null // Will be computed vs reference
    })

    console.log(\`  N=\${N}: λ=\${wavelength.toFixed(2)} grid units\`)
  }

  // Compute errors relative to finest grid (assumed most accurate)
  const reference = results[results.length - 1]
  for (const result of results) {
    result.relativeError = Math.abs(result.normalizedWavelength - reference.normalizedWavelength)
  }

  console.table(results)
  return results
}

// Theoretical wavelength estimate
function theoreticalWavelength(params) {
  const { Du, f } = params
  // Turing wavelength: λ ∝ √(Du/f)
  return 2 * Math.PI * Math.sqrt(Du / f)
}

// Grid independence test
function gridIndependenceTest(results, tolerance = 0.01) {
  if (results.length < 2) return false

  const last = results[results.length - 1]
  const secondLast = results[results.length - 2]

  const relativeChange = Math.abs(last.normalizedWavelength - secondLast.normalizedWavelength) / last.normalizedWavelength

  return relativeChange < tolerance
}

// Error vs grid spacing analysis
function analyzeConvergenceRate(results) {
  if (results.length < 3) return null

  // Fit E = C * h^p to error vs grid spacing
  const logH = results.map(r => Math.log(r.gridSpacing))
  const logE = results.map(r => Math.log(Math.max(r.relativeError, 1e-10)))

  // Simple linear regression: log(E) = log(C) + p*log(h)
  const n = logH.length
  const sumLogH = logH.reduce((a, b) => a + b, 0)
  const sumLogE = logE.reduce((a, b) => a + b, 0)
  const sumLogH2 = logH.reduce((a, b) => a + b*b, 0)
  const sumLogHE = logH.map((h, i) => h * logE[i]).reduce((a, b) => a + b, 0)

  const slope = (n * sumLogHE - sumLogH * sumLogE) / (n * sumLogH2 - sumLogH * sumLogH)
  const intercept = (sumLogE - slope * sumLogH) / n

  return {
    convergenceRate: slope,
    constant: Math.exp(intercept),
    rSquared: null // Could compute correlation coefficient
  }
}</code></pre></div>`,

  init(container, state) {
    // Create D3 convergence study visualization
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

    // Synthetic convergence data
    const convergenceData = [
      { N: 32, h: 1/32, error: 0.15, label: '32²' },
      { N: 64, h: 1/64, error: 0.08, label: '64²' },
      { N: 128, h: 1/128, error: 0.04, label: '128²' },
      { N: 256, h: 1/256, error: 0.02, label: '256²' }
    ]

    // Scales (log-log)
    const xScale = d3.scaleLog()
      .domain([1/300, 1/25])
      .range([0, width])

    const yScale = d3.scaleLog()
      .domain([0.01, 0.2])
      .range([height, 0])

    // Data points
    g.selectAll('.convergence-point')
      .data(convergenceData)
      .enter()
      .append('circle')
      .attr('class', 'convergence-point')
      .attr('cx', d => xScale(d.h))
      .attr('cy', d => yScale(d.error))
      .attr('r', 6)
      .attr('fill', '#2ca02c')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Labels for points
    g.selectAll('.point-label')
      .data(convergenceData)
      .enter()
      .append('text')
      .attr('class', 'point-label')
      .attr('x', d => xScale(d.h) + 8)
      .attr('y', d => yScale(d.error) - 8)
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text(d => d.label)

    // Best-fit line (slope ≈ 1 for first-order)
    const fitLine = g.append('line')
      .attr('x1', xScale(1/250))
      .attr('y1', yScale(0.18))
      .attr('x2', xScale(1/30))
      .attr('y2', yScale(0.018))
      .attr('stroke', '#d62728')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    // Slope annotation
    g.append('text')
      .attr('x', xScale(1/100))
      .attr('y', yScale(0.06))
      .style('font-size', '12px')
      .style('fill', '#d62728')
      .style('font-weight', 'bold')
      .text('slope ≈ 1')

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5, ".0e")
      .tickFormat(d3.format(".0e"))

    const yAxis = d3.axisLeft(yScale)
      .ticks(5, ".0e")
      .tickFormat(d3.format(".0e"))

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

    g.append('g')
      .call(yAxis)

    // Labels
    g.append('text')
      .attr('transform', `translate(${width/2}, ${height + 50})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Grid Spacing (h = 1/N)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Relative Error')

    // Title
    g.append('text')
      .attr('x', width/2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Spatial Convergence Study')

    return function cleanup() {
      container.innerHTML = ''
    }
  }
}
