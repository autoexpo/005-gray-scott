/**
 * Step 56: The (f,k) Parameter Map
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'
import * as d3 from 'd3'

export default {
  title: 'The (f,k) Parameter Map',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>The Munafo/Pearson Parameter Map</h3>
  <p>The (f,k) parameter space can be divided into named regions, each producing
  distinct pattern morphologies. This 2D phase diagram is one of the most important
  tools for understanding Gray-Scott dynamics.</p>
</div>

<div class="math-section">
  <h3>Parameter Map as 2D Phase Diagram</h3>
  <p>Each point (f,k) in the parameter plane corresponds to a different dynamical
  regime. The boundaries between regions represent bifurcations where the pattern
  type changes qualitatively.</p>
</div>

<div class="math-section">
  <h3>Bifurcation Boundaries Between Pattern Types</h3>
  <p>The transitions between pattern regions occur along curves in (f,k) space:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Spots ↔ Stripes boundary near f ≈ 0.045</li>
    <li>Stripes ↔ Worms transition as f increases</li>
    <li>Mitosis ↔ Chaos boundary as k decreases</li>
    <li>Pattern death boundaries at extreme parameter values</li>
  </ul>
</div>

<div class="math-section">
  <h3>How to Read the Map</h3>
  <p>Navigate the parameter map by:</p>
  <ol style="margin-left:16px; line-height:1.9">
    <li>Locate your current (f,k) position</li>
    <li>Identify the pattern region</li>
    <li>Predict changes by moving in parameter space</li>
    <li>Understand sensitivity near boundaries</li>
  </ol>
</div>

<div class="math-section">
  <h3>Sensitivity Near Boundaries</h3>
  <p>Small parameter changes have the largest effect near bifurcation boundaries.
  Moving 0.001 in f or k can completely change the pattern type when near
  a transition curve.</p>
</div>

<div class="math-section">
  <h3>Role of Du/Dv in Shifting Boundary Locations</h3>
  <p>The diffusion ratio Du/Dv affects the entire parameter map:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Higher Du/Dv → patterns become larger and more connected</li>
    <li>Lower Du/Dv → patterns fragment into smaller isolated domains</li>
    <li>Boundary curves shift but maintain similar topology</li>
  </ul>
</div>
`,

  code: `
<div class="code-section">
  <h3>PRESET_NAMES and (f,k) Coordinates</h3>
<pre><code class="language-js">// Map preset names to their (f,k) coordinates
const presetCoords = Object.entries(PRESETS).map(([name, preset]) => ({
  name,
  f: preset.f,
  k: preset.k,
  label: preset.label,
  description: preset.description
}))

console.log('Preset coordinates:')
presetCoords.forEach(p => {
  console.log(\`\${p.name}: (f=\${p.f}, k=\${p.k})\`)
})

// Output:
// spots: (f=0.035, k=0.065)
// stripes: (f=0.060, k=0.062)
// worms: (f=0.078, k=0.061)
// mitosis: (f=0.028, k=0.053)
// bubbles: (f=0.098, k=0.057)
// coral: (f=0.059, k=0.062)
// solitons: (f=0.030, k=0.057)
// chaos: (f=0.026, k=0.051)
// negSpots: (f=0.039, k=0.058)
// waves: (f=0.014, k=0.045)
</code></pre>
</div>

<div class="code-section">
  <h3>JavaScript to Render Parameter Map Grid</h3>
<pre><code class="language-js">// Render a mini parameter map as a grid of simulations
// This would run multiple Gray-Scott instances in parallel
// and display the results as a parameter sweep

async function renderParameterMap(container, gridSize = 10) {
  const fMin = 0.01, fMax = 0.10
  const kMin = 0.04, kMax = 0.07

  const fStep = (fMax - fMin) / gridSize
  const kStep = (kMax - kMin) / gridSize

  const results = []

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const f = fMin + i * fStep
      const k = kMin + j * kStep

      // Run a mini simulation for this (f,k) point
      const pattern = await runMiniSimulation({ f, k, Du: 0.2097, Dv: 0.105 })
      
      results.push({
        f, k, i, j, 
        pattern,
        patternType: classifyPattern(pattern)
      })
    }
  }

  // Render as color-coded grid
  renderGrid(container, results, gridSize)
}

function classifyPattern(imageData) {
  // Analyze pattern characteristics
  const stats = analyzePatternStats(imageData)
  
  if (stats.numComponents < 5 && stats.avgSize > 100) return 'spots'
  if (stats.numComponents > 20 && stats.connectivity > 0.8) return 'stripes'
  if (stats.numComponents > 50) return 'worms'
  if (stats.fills > 0.7) return 'bubbles'
  
  return 'unknown'
}
</code></pre>
</div>
`,

  init(container) {
    // Create D3 scatter plot of presets in (f,k) space
    const margin = { top: 20, right: 20, bottom: 50, left: 60 }
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0.01, 0.10])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0.04, 0.07])
      .range([height, 0])

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .style('text-anchor', 'middle')
      .text('f (feed rate)')

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .text('k (kill rate)')

    // Plot preset points
    const presets = Object.entries(PRESETS).map(([name, preset]) => ({
      name,
      f: preset.f,
      k: preset.k,
      label: preset.label
    }))

    g.selectAll('.preset-point')
      .data(presets)
      .enter().append('circle')
      .attr('class', 'preset-point')
      .attr('cx', d => xScale(d.f))
      .attr('cy', d => yScale(d.k))
      .attr('r', 6)
      .style('fill', (d, i) => d3.schemeCategory10[i])
      .style('stroke', '#000')
      .style('stroke-width', 1)

    // Labels
    g.selectAll('.preset-label')
      .data(presets)
      .enter().append('text')
      .attr('class', 'preset-label')
      .attr('x', d => xScale(d.f) + 8)
      .attr('y', d => yScale(d.k) + 3)
      .style('font-size', '12px')
      .text(d => d.name)

    // Add approximate region boundaries (simplified)
    const boundaryData = [
      // Spots to stripes boundary
      { x1: 0.04, y1: 0.065, x2: 0.05, y2: 0.063 },
      // Add more boundaries as needed
    ]

    g.selectAll('.boundary')
      .data(boundaryData)
      .enter().append('line')
      .attr('class', 'boundary')
      .attr('x1', d => xScale(d.x1))
      .attr('y1', d => yScale(d.y1))
      .attr('x2', d => xScale(d.x2))
      .attr('y2', d => yScale(d.y2))
      .style('stroke', '#666')
      .style('stroke-dasharray', '3,3')

    return () => svg.remove()
  }
}
