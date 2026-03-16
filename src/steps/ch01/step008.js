/**
 * Step 8: Phase space overview — the (f,k) parameter map.
 * Shows a pre-computed grid of pattern thumbnails.
 */
import * as d3 from 'd3'

export default {
  title: 'Phase Space: the (f,k) Map',
  chapter: 1,

  math: `
<div class="math-section">
  <h3>The Parameter Phase Diagram</h3>
  <p>The (f,k) parameter space is the primary "control surface" of the Gray-Scott model.
  Different regions produce qualitatively distinct pattern types.</p>
</div>

<div class="math-section">
  <h3>Major Pattern Regions</h3>
  <table style="border-collapse:collapse; margin-top:8px; font-size:9pt">
    <tr style="border-bottom:1px solid #000">
      <th style="padding:3px 8px; text-align:left">Region (f,k)</th>
      <th style="padding:3px 8px; text-align:left">Pattern</th>
    </tr>
    <tr><td style="padding:2px 8px">0.010–0.040, 0.044–0.058</td><td style="padding:2px 8px">Mitosis / self-replication</td></tr>
    <tr><td style="padding:2px 8px">0.030–0.060, 0.055–0.066</td><td style="padding:2px 8px">Spots / coral</td></tr>
    <tr><td style="padding:2px 8px">0.055–0.080, 0.060–0.065</td><td style="padding:2px 8px">Stripes / labyrinths</td></tr>
    <tr><td style="padding:2px 8px">0.070–0.100, 0.055–0.062</td><td style="padding:2px 8px">Worms / bubbles</td></tr>
    <tr><td style="padding:2px 8px">f > 0.10 or k < 0.04</td><td style="padding:2px 8px">No pattern (trivial)</td></tr>
  </table>
</div>

<div class="math-section">
  <h3>Pattern Classification (Pearson 1993)</h3>
  <p>John Pearson's seminal 1993 paper mapped the entire (f,k) space,
  labeling regions by letter (A–H, η, θ, ι, κ, λ, μ):</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>A</strong>: blue (trivial, V→0)</li>
    <li><strong>B</strong>: red (V fills everything)</li>
    <li><strong>C</strong>: stripes/labyrinths</li>
    <li><strong>D</strong>: spots to stripes transition</li>
    <li><strong>E</strong>: moving spots</li>
    <li><strong>F,G,H</strong>: complex transient dynamics</li>
  </ul>
</div>

<div class="math-section">
  <h3>Exploring the Phase Space</h3>
  <p>In Step 56 we'll build an interactive (f,k) map showing live mini-simulations.
  For now, the visualization shows named presets plotted on the (f,k) plane.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Named Presets from the Phase Map</h3>
  <div class="filename">src/presets/parameters.js</div>
<pre><code class="language-js">export const PRESETS = {
  spots:   { f: 0.035, k: 0.065, label: 'Spots' },
  stripes: { f: 0.060, k: 0.062, label: 'Stripes' },
  worms:   { f: 0.078, k: 0.061, label: 'Worms' },
  mitosis: { f: 0.028, k: 0.053, label: 'Mitosis' },
  bubbles: { f: 0.098, k: 0.057, label: 'Bubbles' },
  coral:   { f: 0.059, k: 0.062, label: 'Coral' },
  solitons:{ f: 0.030, k: 0.057, label: 'Solitons' },
  chaos:   { f: 0.026, k: 0.051, label: 'Chaos' },
  // All use Du=0.2097, Dv=0.105
}
</code></pre>
</div>

<div class="code-section">
  <h3>Loading a Preset</h3>
<pre><code class="language-js">function loadPreset(name) {
  const preset = PRESETS[name]
  if (!preset) return

  // Update simulation parameters
  Object.assign(currentParams, preset)

  // Reset simulation with new params
  // (patterns take 1000-5000 steps to form)
  sim.reset(currentParams)

  // Update GUI to reflect new values
  gui.controllers.forEach(c => c.updateDisplay())
}
</code></pre>
</div>
`,

  init(container) {
    const S = 512
    const margin = { top: 30, right: 120, bottom: 60, left: 60 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // f range: 0.01 to 0.12, k range: 0.04 to 0.075
    const fMin = 0.01, fMax = 0.12
    const kMin = 0.04, kMax = 0.075

    const x = d3.scaleLinear().domain([fMin, fMax]).range([0, W])
    const y = d3.scaleLinear().domain([kMin, kMax]).range([H, 0])

    // Background regions (approximate)
    const regions = [
      { f1:0.01,f2:0.05, k1:0.044,k2:0.060, label:'mitosis', gray:0.92 },
      { f1:0.03,f2:0.07, k1:0.056,k2:0.068, label:'spots/coral', gray:0.80 },
      { f1:0.055,f2:0.09,k1:0.059,k2:0.065, label:'stripes', gray:0.70 },
      { f1:0.07,f2:0.11, k1:0.054,k2:0.062, label:'worms/bubbles', gray:0.85 },
    ]

    regions.forEach(r => {
      const gVal = Math.round(r.gray * 255)
      g.append('rect')
        .attr('x', x(r.f1))
        .attr('y', y(r.k2))
        .attr('width', x(r.f2) - x(r.f1))
        .attr('height', y(r.k1) - y(r.k2))
        .attr('fill', `rgb(${gVal},${gVal},${gVal})`)

      g.append('text')
        .attr('x', x(r.f1) + 2)
        .attr('y', y(r.k2) + 11)
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '8pt')
        .attr('fill', '#666')
        .text(r.label)
    })

    // Axes
    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).tickFormat(d3.format('.2f')))
    g.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.3f')))

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', '#000')
    g.selectAll('.tick text').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '7pt').attr('fill', '#555')

    // Axis labels
    g.append('text').attr('x', W/2).attr('y', H + 50).style('text-anchor', 'middle').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').text('f (feed rate) →')
    g.append('text').attr('x', -40).attr('y', H/2).style('text-anchor', 'middle').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('transform', `rotate(-90, -40, ${H/2})`).text('k (kill rate) →')

    const presets = [
      { f: 0.035, k: 0.065, label: 'Spots' },
      { f: 0.060, k: 0.062, label: 'Stripes' },
      { f: 0.078, k: 0.061, label: 'Worms' },
      { f: 0.028, k: 0.053, label: 'Mitosis' },
      { f: 0.098, k: 0.057, label: 'Bubbles' },
      { f: 0.059, k: 0.062, label: 'Coral' },
      { f: 0.030, k: 0.057, label: 'Solitons' },
      { f: 0.026, k: 0.051, label: 'Chaos' },
    ]

    // Plot preset points
    presets.forEach(p => {
      g.append('circle')
        .attr('cx', x(p.f))
        .attr('cy', y(p.k))
        .attr('r', 4)
        .attr('fill', '#000')

      g.append('text')
        .attr('x', x(p.f) + 6)
        .attr('y', y(p.k) + 3)
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '8pt')
        .attr('fill', '#000')
        .text(p.label)
    })

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
