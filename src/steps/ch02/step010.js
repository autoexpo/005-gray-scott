/**
 * Step 10: Initializing U and V — seed, fill, boundary.
 */
import * as d3 from 'd3'

export default {
  title: '1D Init: Seed Strategies',
  chapter: 2,

  math: `
<div class="math-section">
  <h3>Initial Conditions</h3>
  <p>The eventual pattern depends only weakly on initial conditions
  (Turing patterns are attractors). However, the <em>transient</em> dynamics
  and pattern nucleation do depend on the seed.</p>
</div>
<div class="math-section">
  <h3>Common Seed Strategies</h3>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Center square:</strong> V=1, U=0 in a small central region</li>
    <li><strong>Random noise:</strong> small random V perturbations everywhere</li>
    <li><strong>Stripes of V:</strong> tests whether stripes or spots are preferred</li>
    <li><strong>Single point:</strong> minimal perturbation from homogeneous state</li>
  </ul>
</div>
<div class="math-section">
  <h3>Noise for Symmetry Breaking</h3>
  <p>For a truly uniform seed, the system would never leave U=1, V=0
  (it's a fixed point). A tiny perturbation breaks the symmetry
  and allows Turing instability to develop.</p>
  <div class="math-block">$$U(x,0) = 1 - \\epsilon(x), \\quad V(x,0) = \\epsilon(x)$$</div>
  <p>where ε(x) is small random noise in [0, 0.01].</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Seed Strategies</h3>
<pre><code class="language-js">// Strategy 1: center patch
function seedCenter(u, v, N, halfW = 5) {
  u.fill(1.0); v.fill(0.0)
  const mid = Math.floor(N / 2)
  for (let i = mid - halfW; i <= mid + halfW; i++) {
    u[i] = 0.0
    v[i] = 1.0
  }
}

// Strategy 2: random noise
function seedRandom(u, v, N, density = 0.02) {
  u.fill(1.0); v.fill(0.0)
  for (let i = 0; i < N; i++) {
    if (Math.random() < density) {
      u[i] = 0.5 + Math.random() * 0.5
      v[i] = Math.random() * 0.5
    }
  }
}

// Strategy 3: checkerboard perturbation
function seedCheckerboard(u, v, N, amp = 0.1) {
  for (let i = 0; i < N; i++) {
    u[i] = 1.0 - amp * (i % 2)
    v[i] = amp * (i % 2)
  }
}
</code></pre>
</div>
`,

  init(container) {
    const S = 512
    const margin = { top: 20, right: 20, bottom: 20, left: 100 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const N = 200

    const strategies = [
      { label: 'center patch', gen: () => {
        const u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
        const m = Math.floor(N/2)
        for (let i = m-5; i <= m+5; i++) { u[i]=0; v[i]=1 }
        return { u, v }
      }},
      { label: 'random noise', gen: () => {
        const u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
        for (let i = 0; i < N; i++) if (Math.random()<0.05) { u[i]=0.5; v[i]=0.5 }
        return { u, v }
      }},
      { label: 'checkerboard', gen: () => {
        const u = new Float32Array(N), v = new Float32Array(N)
        for (let i = 0; i < N; i++) { u[i]=1-0.1*(i%2); v[i]=0.1*(i%2) }
        return { u, v }
      }},
    ]

    const rowH = H / strategies.length
    const x = d3.scaleLinear().domain([0, 1]).range([0, W])
    const y = d3.scaleLinear().domain([0, 1]).range([rowH - 20, 0])

    const lineGen = d3.line().x(d => x(d[0])).y(d => y(d[1]))

    strategies.forEach((s, si) => {
      const { u, v } = s.gen()
      const panelG = g.append('g').attr('transform', `translate(0, ${si * rowH})`)

      // Panel label
      panelG.append('text')
        .attr('x', -90).attr('y', rowH/2 + 4)
        .style('font-family', 'SF Mono, Menlo, monospace')
        .style('font-size', '8pt')
        .attr('fill', '#666')
        .text(s.label)

      // Data
      const uData = Array.from(u).map((val, i) => [i / (N-1), val])
      const vData = Array.from(v).map((val, i) => [i / (N-1), val])

      // U line (black)
      panelG.append('path')
        .datum(uData)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .attr('d', lineGen)

      // V line (gray)
      panelG.append('path')
        .datum(vData)
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .attr('d', lineGen)

      // Separator line
      if (si < strategies.length - 1) {
        panelG.append('line')
          .attr('x1', 0).attr('x2', W)
          .attr('y1', rowH - 4).attr('y2', rowH - 4)
          .attr('stroke', '#ddd')
          .attr('stroke-width', 0.5)
      }
    })

    // Legend
    g.append('text')
      .attr('x', W - 100).attr('y', 10)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '9pt')
      .attr('fill', '#000')
      .text('U (black), V (gray)')

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
