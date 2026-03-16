/**
 * Step 79: Mass Conservation Check
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Mass Conservation Check',
  chapter: 7,

  math: `<div class="math-section"><h3>Mass Conservation in Gray-Scott</h3>
<p>Gray-Scott is <strong>not</strong> mass-conservative due to feed and kill terms:</p>
<div class="math-block">$$\\frac{\\partial}{\\partial t} \\int (U + V) \\, dA = \\int [f(1-U) - kV] \\, dA$$</div>
<p>At steady state, the mass balance becomes:</p>
<div class="math-block">$$\\frac{dM}{dt} = f \\sum (1-U_i) - k \\sum V_i \\approx 0$$</div>
<p>where M = ΣU + ΣV is the total "material" in the system.</p>
<p><strong>Expected behavior</strong>:</p>
<ul>
<li><strong>Initial transient</strong>: M changes rapidly as patterns form</li>
<li><strong>Steady state</strong>: M oscillates around equilibrium value</li>
<li><strong>Feed-kill balance</strong>: f × (cells with U < 1) ≈ k × ΣV</li>
<li><strong>Numerical drift</strong>: Small accumulated floating-point errors</li>
</ul>
<p><strong>Conservation check uses</strong>:</p>
<ul>
<li>Detect numerical instability (sudden M jumps or NaN)</li>
<li>Monitor simulation health over long runs</li>
<li>Validate integrator implementations</li>
<li>Study pattern formation energetics</li>
</ul></div>`,

  code: `<div class="code-section"><h3>GPU Mass Tracking</h3>
<pre><code class="language-js">// Read back GPU texture data to compute mass
function computeMass(renderer, renderTarget, size) {
  const pixels = new Float32Array(size * size * 4)
  renderer.readRenderTargetPixels(renderTarget, 0, 0, size, size, pixels)

  let sumU = 0, sumV = 0, sumTotal = 0
  let minU = Infinity, maxU = -Infinity
  let minV = Infinity, maxV = -Infinity
  let nanCount = 0

  for (let i = 0; i < pixels.length; i += 4) {
    const u = pixels[i]
    const v = pixels[i + 1]

    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      nanCount++
      continue
    }

    sumU += u
    sumV += v
    sumTotal += u + v

    minU = Math.min(minU, u)
    maxU = Math.max(maxU, u)
    minV = Math.min(minV, v)
    maxV = Math.max(maxV, v)
  }

  const numCells = (size * size) - nanCount

  return {
    sumU: sumU,
    sumV: sumV,
    sumTotal: sumTotal,
    avgU: sumU / numCells,
    avgV: sumV / numCells,
    avgTotal: sumTotal / numCells,
    rangeU: [minU, maxU],
    rangeV: [minV, maxV],
    nanCount: nanCount,
    isStable: nanCount === 0 && isFinite(sumTotal)
  }
}

// Mass conservation monitor
class MassTracker {
  constructor(maxHistory = 1000) {
    this.history = []
    this.maxHistory = maxHistory
    this.startTime = performance.now()
  }

  update(massData) {
    const time = performance.now() - this.startTime
    const entry = {
      time: time / 1000, // Convert to seconds
      ...massData
    }

    this.history.push(entry)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }

    return entry
  }

  analyze() {
    if (this.history.length < 2) return null

    const recent = this.history.slice(-100) // Last 100 points
    const start = recent[0]
    const end = recent[recent.length - 1]

    const dMdt = (end.sumTotal - start.sumTotal) / (end.time - start.time)
    const avgMass = recent.reduce((sum, entry) => sum + entry.sumTotal, 0) / recent.length

    // Detect sudden jumps (instability indicator)
    let maxJump = 0
    for (let i = 1; i < recent.length; i++) {
      const jump = Math.abs(recent[i].sumTotal - recent[i-1].sumTotal)
      maxJump = Math.max(maxJump, jump)
    }

    return {
      dMdt: dMdt.toFixed(6),
      avgMass: avgMass.toFixed(3),
      maxJump: maxJump.toFixed(6),
      isConverged: Math.abs(dMdt) < 0.001,
      isStable: maxJump < 1.0
    }
  }

  getLastN(n = 100) {
    return this.history.slice(-n)
  }
}

// Expected steady-state mass
function estimateEquilibriumMass(params, gridSize) {
  const { f, k } = params
  const numCells = gridSize * gridSize

  // Rough estimate based on typical pattern coverage
  const typicalUCoverage = 0.7 // ~70% of domain has U ≈ 1
  const typicalVCoverage = 0.3 // ~30% has active V

  const expectedSumU = typicalUCoverage * numCells
  const expectedSumV = (f / k) * typicalVCoverage * numCells // From steady-state balance

  return expectedSumU + expectedSumV
}</code></pre></div>`,

  init(container, state) {
    // Create D3 mass tracking visualization
    const margin = { top: 40, right: 80, bottom: 60, left: 80 }
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

    // Simulation setup
    const gridSize = 128
    const params = { f: 0.035, k: 0.065, Du: 0.2097, Dv: 0.105, dt: 1.0 }

    // Initialize fields
    let u = new Float32Array(gridSize * gridSize)
    let v = new Float32Array(gridSize * gridSize)

    // Initial conditions
    for (let i = 0; i < u.length; i++) {
      u[i] = 0.5 + 0.1 * (Math.random() - 0.5)
      v[i] = 0.25 + 0.05 * (Math.random() - 0.5)
    }

    // Add initial perturbation
    const center = Math.floor(gridSize / 2)
    for (let dy = -5; dy <= 5; dy++) {
      for (let dx = -5; dx <= 5; dx++) {
        const idx = (center + dy) * gridSize + (center + dx)
        if (idx >= 0 && idx < u.length) {
          v[idx] += 0.3
        }
      }
    }

    const massData = []
    let maxTime = 20 // 20 seconds
    let step = 0

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, maxTime])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, gridSize * gridSize * 1.2])
      .range([height, 0])

    // Lines
    const lineU = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.sumU))

    const lineV = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.sumV))

    // Paths
    const pathU = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)

    const pathV = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 2)

    // Axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)

    // Labels
    g.append('text')
      .attr('transform', `translate(${width/2}, ${height + 50})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Time (s)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Total Mass')

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 80}, 20)`)

    legend.append('line')
      .attr('x1', 0).attr('x2', 15)
      .attr('y1', 0).attr('y2', 0)
      .attr('stroke', '#000').attr('stroke-width', 2)

    legend.append('text')
      .attr('x', 20).attr('y', 5)
      .style('font-size', '12px').text('ΣU')

    legend.append('line')
      .attr('x1', 0).attr('x2', 15)
      .attr('y1', 20).attr('y2', 20)
      .attr('stroke', '#666').attr('stroke-width', 2)

    legend.append('text')
      .attr('x', 20).attr('y', 25)
      .style('font-size', '12px').text('ΣV')

    // Title
    g.append('text')
      .attr('x', width/2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Mass Conservation Tracking')

    // Simulation controls
    let paused = false
    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => {
        // Reset simulation
        for (let i = 0; i < u.length; i++) {
          u[i] = 0.5 + 0.1 * (Math.random() - 0.5)
          v[i] = 0.25 + 0.05 * (Math.random() - 0.5)
        }
        const center = Math.floor(gridSize / 2)
        for (let dy = -5; dy <= 5; dy++) {
          for (let dx = -5; dx <= 5; dx++) {
            const idx = (center + dy) * gridSize + (center + dx)
            if (idx >= 0 && idx < u.length) {
              v[idx] += 0.3
            }
          }
        }
        massData.length = 0
        step = 0
      }
    })

    // Animation loop
    let lastTime = 0
    function animate(currentTime) {
      if (!paused) {
        // Simple CPU Gray-Scott step
        simpleGrayScottStep(u, v, params, gridSize)
        step++

        if (step % 10 === 0) { // Update chart every 10 steps
          const time = step * params.dt / 60 // Convert to seconds (assuming 60 fps)

          let sumU = 0, sumV = 0
          for (let i = 0; i < u.length; i++) {
            sumU += u[i]
            sumV += v[i]
          }

          massData.push({ time, sumU, sumV })

          // Update chart
          if (massData.length > 1) {
            pathU.datum(massData).attr('d', lineU)
            pathV.datum(massData).attr('d', lineV)
          }

          // Update x-scale if needed
          if (time > maxTime) {
            maxTime = time + 10
            xScale.domain([0, maxTime])
            g.select('.x-axis').call(xAxis)
          }
        }
      }

      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return function cleanup() {
      controls.remove()
      container.innerHTML = ''
    }
  }
}

// Simple CPU Gray-Scott step for demo
function simpleGrayScottStep(u, v, params, size) {
  const { f, k, Du, Dv, dt } = params
  const uNew = new Float32Array(u.length)
  const vNew = new Float32Array(v.length)

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = y * size + x

      // Simple 5-point Laplacian
      const lapU = u[(y-1)*size + x] + u[(y+1)*size + x] + u[y*size + (x-1)] + u[y*size + (x+1)] - 4*u[idx]
      const lapV = v[(y-1)*size + x] + v[(y+1)*size + x] + v[y*size + (x-1)] + v[y*size + (x+1)] - 4*v[idx]

      // Reaction
      const ui = u[idx], vi = v[idx]
      const uv2 = ui * vi * vi

      uNew[idx] = ui + dt * (Du * lapU - uv2 + f * (1 - ui))
      vNew[idx] = vi + dt * (Dv * lapV + uv2 - (f + k) * vi)
    }
  }

  u.set(uNew)
  v.set(vNew)
}
