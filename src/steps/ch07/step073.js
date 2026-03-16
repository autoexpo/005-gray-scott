/**
 * Step 73: RK4 Integration — Four-Stage Derivation
 */

import * as d3 from 'd3'

export default {
  title: 'RK4 Integration — Four-Stage Derivation',
  chapter: 7,

  math: `<div class="math-section"><h3>Runge-Kutta 4th Order Method</h3>
<p>The classical fourth-order Runge-Kutta method for solving ODEs ẏ = f(t,y):</p>
<div class="math-block">$$k_1 = f(t, y)$$</div>
<div class="math-block">$$k_2 = f(t + \\frac{h}{2}, y + \\frac{h}{2} k_1)$$</div>
<div class="math-block">$$k_3 = f(t + \\frac{h}{2}, y + \\frac{h}{2} k_2)$$</div>
<div class="math-block">$$k_4 = f(t + h, y + h k_3)$$</div>
<div class="math-block">$$y(t+h) = y(t) + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$</div>
<p>For PDEs like Gray-Scott, each "y" represents the full field u(x,y), and each k_i requires a complete field evaluation:</p>
<ul>
<li><strong>4th-order accuracy</strong>: Local truncation error O(h⁵), global error O(h⁴)</li>
<li><strong>4× compute cost</strong>: Requires 4 function evaluations vs 1 for Euler</li>
<li><strong>Better accuracy per step</strong>: Can use larger dt while maintaining precision</li>
<li><strong>GPU implementation</strong>: Requires 4 render passes with intermediate buffers</li>
</ul>
<p>For Gray-Scott with operator splitting, RK4 is typically applied to the reaction term only:</p>
<div class="math-block">$$\\frac{\\partial u}{\\partial t} = -uv^2 + f(1-u) \\quad \\text{(reaction)}$$</div>
<div class="math-block">$$\\frac{\\partial v}{\\partial t} = uv^2 - (f+k)v \\quad \\text{(reaction)}$$</div>
<p>While diffusion uses the simpler forward Euler with small dt for stability.</p></div>`,

  code: `<div class="code-section"><h3>RK4 Implementation for Gray-Scott Reaction</h3>
<pre><code class="language-js">// RK4 for reaction terms only (operator splitting)
function rk4Reaction(u, v, f, k, dt) {
  const n = u.length

  // Stage 1: k1 = f(t, y)
  const k1u = new Float32Array(n)
  const k1v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ui = u[i], vi = v[i]
    const uv2 = ui * vi * vi
    k1u[i] = -uv2 + f * (1 - ui)
    k1v[i] = uv2 - (f + k) * vi
  }

  // Stage 2: k2 = f(t + h/2, y + h/2*k1)
  const k2u = new Float32Array(n)
  const k2v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ui = u[i] + 0.5 * dt * k1u[i]
    const vi = v[i] + 0.5 * dt * k1v[i]
    const uv2 = ui * vi * vi
    k2u[i] = -uv2 + f * (1 - ui)
    k2v[i] = uv2 - (f + k) * vi
  }

  // Stage 3: k3 = f(t + h/2, y + h/2*k2)
  const k3u = new Float32Array(n)
  const k3v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ui = u[i] + 0.5 * dt * k2u[i]
    const vi = v[i] + 0.5 * dt * k2v[i]
    const uv2 = ui * vi * vi
    k3u[i] = -uv2 + f * (1 - ui)
    k3v[i] = uv2 - (f + k) * vi
  }

  // Stage 4: k4 = f(t + h, y + h*k3)
  const k4u = new Float32Array(n)
  const k4v = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ui = u[i] + dt * k3u[i]
    const vi = v[i] + dt * k3v[i]
    const uv2 = ui * vi * vi
    k4u[i] = -uv2 + f * (1 - ui)
    k4v[i] = uv2 - (f + k) * vi
  }

  // Final update: y(t+h) = y(t) + h/6*(k1 + 2*k2 + 2*k3 + k4)
  for (let i = 0; i < n; i++) {
    u[i] += dt/6 * (k1u[i] + 2*k2u[i] + 2*k3u[i] + k4u[i])
    v[i] += dt/6 * (k1v[i] + 2*k2v[i] + 2*k3v[i] + k4v[i])
  }
}

// Strang splitting: diffusion-reaction-diffusion
function strangSplitStep(u, v, params, dt) {
  // Half-step diffusion
  diffusionStep(u, v, params, dt/2)

  // Full-step reaction (RK4)
  rk4Reaction(u, v, params.f, params.k, dt)

  // Half-step diffusion
  diffusionStep(u, v, params, dt/2)
}</code></pre></div>`,

  init(container, state) {
    // Create D3 accuracy comparison chart (log-log)
    const margin = { top: 40, right: 80, bottom: 60, left: 80 }
    const width = 400 - margin.left - margin.right
    const height = 350 - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('margin', 'auto')
      .style('display', 'block')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Generate synthetic error data
    const dtValues = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0]

    const eulerErrors = dtValues.map(dt => ({
      dt,
      error: Math.pow(dt, 1) * 0.1 // First-order error
    }))

    const rk4Errors = dtValues.map(dt => ({
      dt,
      error: Math.pow(dt, 4) * 0.001 // Fourth-order error
    }))

    // Log scales
    const xScale = d3.scaleLog()
      .domain([0.1, 2.0])
      .range([0, width])

    const yScale = d3.scaleLog()
      .domain([1e-6, 1])
      .range([height, 0])

    // Lines
    const line = d3.line()
      .x(d => xScale(d.dt))
      .y(d => yScale(d.error))

    // Euler line (slope 1)
    g.append('path')
      .datum(eulerErrors)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('d', line)

    // RK4 line (slope 4)
    g.append('path')
      .datum(rk4Errors)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line)

    // Data points
    g.selectAll('.euler-point')
      .data(eulerErrors)
      .enter()
      .append('circle')
      .attr('class', 'euler-point')
      .attr('cx', d => xScale(d.dt))
      .attr('cy', d => yScale(d.error))
      .attr('r', 4)
      .attr('fill', '#000')

    g.selectAll('.rk4-point')
      .data(rk4Errors)
      .enter()
      .append('circle')
      .attr('class', 'rk4-point')
      .attr('cx', d => xScale(d.dt))
      .attr('cy', d => yScale(d.error))
      .attr('r', 4)
      .attr('fill', '#666')

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5, ".1f")
      .tickFormat(d3.format(".1f"))

    const yAxis = d3.axisLeft(yScale)
      .ticks(5, ".0e")

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
      .text('Time Step (Δt)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Integration Error')

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 120}, 30)`)

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#000')
      .attr('stroke-width', 2)

    legend.append('text')
      .attr('x', 25)
      .attr('y', 5)
      .style('font-size', '12px')
      .text('Euler (O(h))')

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    legend.append('text')
      .attr('x', 25)
      .attr('y', 25)
      .style('font-size', '12px')
      .text('RK4 (O(h⁴))')

    // Title
    g.append('text')
      .attr('x', width/2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Integration Method Accuracy')

    return function cleanup() {
      container.innerHTML = ''
    }
  }
}
