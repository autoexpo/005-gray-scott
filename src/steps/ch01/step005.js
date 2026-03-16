/**
 * Step 5: Reaction alone — autocatalysis, the U·V² term.
 */
import * as d3 from 'd3'

export default {
  title: 'Reaction: Autocatalysis',
  chapter: 1,

  math: `
<div class="math-section">
  <h3>Chemical Kinetics</h3>
  <p>The Gray-Scott model is based on an autocatalytic reaction scheme:
  a product V catalyses its own production from the substrate U.</p>
</div>

<div class="math-section">
  <h3>Reaction Network</h3>
  <div class="math-block">$$U + 2V \\xrightarrow{k_1} 3V$$</div>
  <div class="math-block">$$V \\xrightarrow{k_2} P \\text{ (inert)}$$</div>
  <div class="math-block">$$\\emptyset \\xrightarrow{f} U$$</div>
  <p>The first reaction: one U molecule reacts with two V molecules to produce
  three V. This is the "cubic autocatalysis" — V autocatalyses its own production
  at a rate cubic in concentrations (first-order in U, second-order in V).</p>
</div>

<div class="math-section">
  <h3>Mass Action Kinetics</h3>
  <p>By the law of mass action, the reaction rate is proportional to the product
  of reactant concentrations:</p>
  <div class="math-block">$$r = k_1 \\cdot [U][V]^2 = UV^2$$</div>
  <p>(setting k₁=1 for simplicity in the dimensionless model)</p>

  <p>This gives the reaction terms:</p>
  <div class="math-block">$$\\frac{dU}{dt}\\Big|_{\\text{rxn}} = -UV^2 \\quad \\text{(U consumed)}$$</div>
  <div class="math-block">$$\\frac{dV}{dt}\\Big|_{\\text{rxn}} = +UV^2 \\quad \\text{(V produced)}$$</div>
</div>

<div class="math-section">
  <h3>Behaviour without Diffusion</h3>
  <p>In a single well-mixed cell, if U is plentiful (U≈1) and V is seeded:</p>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>V grows rapidly via autocatalysis (UV² is large when U≈1)</li>
    <li>U is consumed, drops toward 0</li>
    <li>As U→0, reaction slows (not enough substrate)</li>
    <li>V is simultaneously removed by the kill term (f+k)V</li>
    <li>The system reaches a steady state or oscillates depending on (f,k)</li>
  </ul>
</div>
`,

  code: `
<div class="code-section">
  <h3>Reaction Only (no diffusion, ODE system)</h3>
<pre><code class="language-js">// Single-cell Gray-Scott: pure reaction, no spatial terms.
// This is an ODE (ordinary differential equation) rather than a PDE.

function reactionOnly(u, v, params) {
  const { f, k, dt } = params

  // Autocatalytic reaction rate
  const uvv = u * v * v   // UV²

  // du/dt: reaction + feed
  const du = -uvv + f * (1 - u)

  // dv/dt: reaction - kill
  const dv = +uvv - (f + k) * v

  return {
    u: Math.max(0, u + dt * du),
    v: Math.max(0, v + dt * dv),
  }
}

// Trace trajectory from seed state
let u = 1.0, v = 0.1  // slight V perturbation
const trace = []
for (let t = 0; t < 2000; t++) {
  ({ u, v } = reactionOnly(u, v, { f: 0.055, k: 0.062, dt: 1.0 }))
  trace.push({ u, v })
}
</code></pre>
</div>

<div class="code-section">
  <h3>Phase Plane Intuition</h3>
<pre><code class="language-js">// The (U,V) phase plane shows all possible trajectories.
// Fixed points satisfy du/dt = 0 AND dv/dt = 0.

// For the trivial state (U=1, V=0):
//   du/dt = -1*0*0 + f*(1-1) = 0  ✓
//   dv/dt = +1*0*0 - (f+k)*0 = 0  ✓
// → Always a fixed point (the "food-only" state)

// Non-trivial fixed points (patterns) exist for
// certain (f,k) combinations — these are what
// Turing instability theory predicts.
</code></pre>
</div>
`,

  init(container) {
    const S = 512
    const margin = { top: 60, right: 20, bottom: 50, left: 60 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 1]).range([0, W])
    const y = d3.scaleLinear().domain([0, 0.5]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(5))

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', '#000')
    g.selectAll('.tick text').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666')

    // Labels
    g.append('text').attr('x', W/2).attr('y', H + 40).style('text-anchor', 'middle').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').text('U (food)')
    g.append('text').attr('x', -40).attr('y', H/2).style('text-anchor', 'middle').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('transform', `rotate(-90, -40, ${H/2})`).text('V (activator)')
    g.append('text').attr('x', 0).attr('y', -10).style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666').text('Phase plane: reaction only (no diffusion)')

    // Trace for multiple (f,k) pairs
    const configs = [
      { f: 0.055, k: 0.062, label: 'f=0.055 k=0.062 (spots)', color: '#000' },
      { f: 0.028, k: 0.053, label: 'f=0.028 k=0.053 (mitosis)', color: '#555' },
      { f: 0.035, k: 0.065, label: 'f=0.035 k=0.065 (stable)', color: '#999' },
    ]

    const traces = configs.map(cfg => {
      let u = 1.0, v = 0.05
      const pts = []
      for (let t = 0; t < 3000; t++) {
        const uvv = u * v * v
        const du = -uvv + cfg.f * (1 - u)
        const dv = uvv - (cfg.f + cfg.k) * v
        u = Math.max(0, Math.min(1, u + du))
        v = Math.max(0, Math.min(1, v + dv))
        if (t % 5 === 0) pts.push([u, v])
      }
      return { pts, label: cfg.label, color: cfg.color }
    })

    // Draw phase trajectories
    traces.forEach((tr, ti) => {
      const line = d3.line().x(d => x(d[0])).y(d => y(d[1]))

      g.append('path')
        .datum(tr.pts)
        .attr('fill', 'none')
        .attr('stroke', tr.color)
        .attr('stroke-width', 1.5)
        .attr('d', line)

      // Start point (circle)
      g.append('circle')
        .attr('cx', x(tr.pts[0][0]))
        .attr('cy', y(tr.pts[0][1]))
        .attr('r', 3)
        .attr('fill', 'none')
        .attr('stroke', tr.color)
        .attr('stroke-width', 1.5)

      // End point (dot)
      const last = tr.pts[tr.pts.length - 1]
      g.append('circle')
        .attr('cx', x(last[0]))
        .attr('cy', y(last[1]))
        .attr('r', 2)
        .attr('fill', tr.color)
    })

    // Legend
    const legend = g.append('g').attr('transform', `translate(${W - 200}, 20)`)
    traces.forEach((tr, ti) => {
      const yPos = ti * 14
      legend.append('rect')
        .attr('x', 0).attr('y', yPos - 8)
        .attr('width', 12).attr('height', 2)
        .attr('fill', tr.color)

      legend.append('text')
        .attr('x', 16).attr('y', yPos - 3)
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '8pt')
        .attr('fill', tr.color)
        .text(tr.label)
    })

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
