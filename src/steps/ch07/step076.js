/**
 * Step 76: Adaptive Time Stepping
 */
import * as d3 from 'd3'

export default {
  title: 'Adaptive Time Stepping',
  chapter: 7,

  math: `<div class="math-section"><h3>Adaptive dt Control</h3>
<p>Adaptive time stepping automatically adjusts dt based on local truncation error:</p>
<div class="math-block">$$\\text{Error estimate:} \\quad E = |u_{\\text{full}} - u_{\\text{half+half}}|$$</div>
<div class="math-block">$$\\text{Step control:} \\quad dt_{\\text{new}} = dt_{\\text{old}} \\left(\\frac{\\text{tol}}{E}\\right)^{1/2}$$</div>
<p><strong>Algorithm</strong>:</p>
<ol>
<li>Take one full step with dt: u₁ = step(u₀, dt)</li>
<li>Take two half steps: u₂ = step(step(u₀, dt/2), dt/2)</li>
<li>Estimate error: E = ||u₁ - u₂||</li>
<li>If E < tol: accept step, increase dt</li>
<li>If E > tol: reject step, decrease dt, retry</li>
</ol>
<p><strong>For Gray-Scott</strong>: Adaptive dt is not usually needed since CFL is easy to satisfy</p>
<p><strong>Useful for</strong>: Stiff variants where reaction rates vary dramatically in space/time</p>
<p><strong>GPU cost</strong>: Requires 3× evaluations (1 full + 2 half steps) per accepted step</p></div>`,

  code: `<div class="code-section"><h3>Adaptive Step Controller</h3>
<pre><code class="language-js">// Adaptive time stepping with error control
class AdaptiveIntegrator {
  constructor(tolerance = 1e-4, dtMin = 0.001, dtMax = 2.0) {
    this.tol = tolerance
    this.dtMin = dtMin
    this.dtMax = dtMax
    this.dtCurrent = 1.0
    this.rejected = 0
    this.accepted = 0
  }

  adaptiveStep(u, v, params, targetDt) {
    let dt = this.dtCurrent
    let stepAccepted = false

    while (!stepAccepted) {
      // Take one full step
      const u1 = new Float32Array(u)
      const v1 = new Float32Array(v)
      this.eulerStep(u1, v1, params, dt)

      // Take two half steps
      const u2 = new Float32Array(u)
      const v2 = new Float32Array(v)
      this.eulerStep(u2, v2, params, dt/2)
      this.eulerStep(u2, v2, params, dt/2)

      // Estimate error (RMS norm)
      const error = this.computeError(u1, v1, u2, v2)

      if (error < this.tol || dt <= this.dtMin) {
        // Accept step
        u.set(u2)  // Use the more accurate half-step result
        v.set(v2)
        stepAccepted = true
        this.accepted++

        // Increase dt for next step
        const factor = Math.pow(this.tol / error, 0.5)
        this.dtCurrent = Math.min(this.dtMax, dt * Math.min(2.0, factor))
      } else {
        // Reject step, reduce dt
        this.rejected++
        const factor = Math.pow(this.tol / error, 0.5)
        dt = Math.max(this.dtMin, dt * Math.max(0.5, factor))
        this.dtCurrent = dt
      }
    }

    return dt
  }

  computeError(u1, v1, u2, v2) {
    let sumSq = 0
    for (let i = 0; i < u1.length; i++) {
      const du = u1[i] - u2[i]
      const dv = v1[i] - v2[i]
      sumSq += du * du + dv * dv
    }
    return Math.sqrt(sumSq / (2 * u1.length))
  }

  getStats() {
    return {
      currentDt: this.dtCurrent,
      accepted: this.accepted,
      rejected: this.rejected,
      efficiency: this.accepted / (this.accepted + this.rejected)
    }
  }
}

// Embedded Euler-Heun pair for error estimation
function embeddedEulerHeun(u, v, params, dt) {
  const n = u.length

  // Euler step (first-order)
  const k1u = new Float32Array(n)
  const k1v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ui = u[i], vi = v[i]
    k1u[i] = grayScottReaction(ui, vi, params).u
    k1v[i] = grayScottReaction(ui, vi, params).v
  }
  const uEuler = u.map((ui, i) => ui + dt * k1u[i])
  const vEuler = v.map((vi, i) => vi + dt * k1v[i])

  // Heun correction (second-order)
  const k2u = new Float32Array(n)
  const k2v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    k2u[i] = grayScottReaction(uEuler[i], vEuler[i], params).u
    k2v[i] = grayScottReaction(vEuler[i], vEuler[i], params).v
  }
  const uHeun = u.map((ui, i) => ui + dt/2 * (k1u[i] + k2u[i]))
  const vHeun = v.map((vi, i) => vi + dt/2 * (k1v[i] + k2v[i]))

  return { uEuler, vEuler, uHeun, vHeun }
}</code></pre></div>`,

  init(container, state) {
    // Create D3 adaptive dt simulation chart
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

    // Generate synthetic adaptive dt trace
    const nSteps = 500
    const data = []
    let dt = 1.0
    const dtTarget = 1.0

    for (let step = 0; step < nSteps; step++) {
      // Simulate adaptive behavior
      const noise = 0.1 * (Math.random() - 0.5)
      const trend = 0.002 * Math.sin(step * 0.05)
      dt = Math.max(0.3, Math.min(1.8, dt + noise + trend))

      data.push({
        step,
        dt,
        target: dtTarget
      })
    }

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, nSteps])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, 2.0])
      .range([height, 0])

    // Lines
    const line = d3.line()
      .x(d => xScale(d.step))
      .y(d => yScale(d.dt))

    // Target dt (baseline)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(dtTarget))
      .attr('y2', yScale(dtTarget))
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    g.append('text')
      .attr('x', width - 5)
      .attr('y', yScale(dtTarget) - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text('dt baseline = 1.0')

    // Adaptive dt trace
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2ca02c')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(8)
    const yAxis = d3.axisLeft(yScale).ticks(6)

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
      .text('Time Steps')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Adaptive Δt')

    // Title
    g.append('text')
      .attr('x', width/2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Adaptive Time Step Evolution')

    return function cleanup() {
      container.innerHTML = ''
    }
  }
}
