/**
 * Step 4: The Laplacian operator — spatial second derivative, 5-point stencil.
 * Interactive: hover a cell and see its Laplacian highlighted.
 */
import * as d3 from 'd3'

export default {
  title: 'The Laplacian Operator',
  chapter: 1,

  math: `
<div class="math-section">
  <h3>The Laplacian in 2D</h3>
  <p>The Laplacian of a scalar field u at point (x,y):</p>
  <div class="math-block">$$\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2}$$</div>
  <p>On a regular 2D grid with spacing h=1, we approximate both partial
  second derivatives using finite differences:</p>
</div>

<div class="math-section">
  <h3>5-Point Finite Difference Stencil</h3>
  <div class="math-block">$$\\nabla^2 u_{i,j} \\approx u_{i-1,j} + u_{i+1,j} + u_{i,j-1} + u_{i,j+1} - 4u_{i,j}$$</div>
  <p>Visually, this is the "plus" stencil:</p>
<pre style="border:none; background:none; text-align:center; font-size:11pt; line-height:1.8; margin:8px 0">
        +1
    +1  −4  +1
        +1
</pre>
  <p>The second-order truncation error is $O(h^2)$: halving the grid spacing
  reduces the error by a factor of 4.</p>
</div>

<div class="math-section">
  <h3>Why "Deviation from Average"</h3>
  <p>Rewrite the stencil:</p>
  <div class="math-block">$$\\nabla^2 u_{i,j} = \\left(\\frac{u_{i-1,j}+u_{i+1,j}+u_{i,j-1}+u_{i,j+1}}{4}\\right) - u_{i,j} \\times 4$$</div>
  <p>Wait — actually:</p>
  <div class="math-block">$$= 4\\left(\\underbrace{\\bar{u}_{\\text{cardinal}}}_{\\text{mean of 4 neighbours}} - u_{i,j}\\right)$$</div>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>∇²u > 0: cell is a <strong>local minimum</strong> → gains</li>
    <li>∇²u < 0: cell is a <strong>local maximum</strong> → loses</li>
    <li>∇²u = 0: cell equals neighbour mean → steady</li>
  </ul>
</div>

<div class="math-section">
  <h3>Error and Isotropy</h3>
  <p>The 5-point stencil has a directional bias: it treats the x and y axes
  identically but ignores diagonals. This produces slightly diamond-shaped
  diffusion at coarse resolutions. The 9-point stencil (Step 27) corrects this.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>5-Point Laplacian in JavaScript</h3>
  <div class="filename">src/cpu/Laplacian.js</div>
<pre><code class="language-js">/**
 * 5-point Laplacian for cell (r, c).
 * Uses periodic boundary conditions via grid.idx().
 *
 * @param {Float32Array} arr - concentration field
 * @param {Grid} grid       - provides idx(r,c) with wrap
 * @param {number} r        - row
 * @param {number} c        - column
 * @returns {number}        - Laplacian value
 */
function lap5(arr, grid, r, c) {
  return arr[grid.idx(r - 1, c)]  // north
       + arr[grid.idx(r + 1, c)]  // south
       + arr[grid.idx(r, c - 1)]  // west
       + arr[grid.idx(r, c + 1)]  // east
       - 4.0 * arr[grid.idx(r, c)] // centre ×−4
}

// Periodic wrap: handles edges transparently
function idx(r, c) {
  const row = ((r % H) + H) % H
  const col = ((c % W) + W) % W
  return row * W + col
}
</code></pre>
</div>

<div class="code-section">
  <h3>GLSL equivalent (GPU)</h3>
<pre><code class="language-glsl">// In the simulation fragment shader:
// uTexelSize = vec2(1/width, 1/height)
// vUv = current texel UV coordinate

float u = texture2D(uState, vUv).r;

float lapU =
  texture2D(uState, vUv + vec2( ts.x,  0.0)).r
+ texture2D(uState, vUv + vec2(-ts.x,  0.0)).r
+ texture2D(uState, vUv + vec2( 0.0,  ts.y)).r
+ texture2D(uState, vUv + vec2( 0.0, -ts.y)).r
- 4.0 * u;

// Texture wrap mode = RepeatWrapping
// → automatic periodic boundary conditions
</code></pre>
</div>
`,

  init(container) {
    const S = 512
    const margin = { top: 20, right: 20, bottom: 60, left: 20 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Small demo grid
    const GW = 9, GH = 9
    const grid = new Float32Array(GW * GH)
    // Put a bump in the middle
    for (let r = 0; r < GH; r++) {
      for (let c = 0; c < GW; c++) {
        const dr = r - 4, dc = c - 4
        grid[r * GW + c] = Math.exp(-(dr*dr + dc*dc) / 4) * 0.8
      }
    }

    let hoverR = 4, hoverC = 4
    const cellW = W / GW
    const cellH = H / GH

    // Info label
    const infoLabel = g.append('text')
      .attr('x', 0).attr('y', H + 50)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '9pt')
      .attr('fill', '#000')

    function draw() {
      // Clear existing cells
      g.selectAll('rect').remove()
      g.selectAll('.cell-text').remove()

      // Draw grid cells
      for (let r = 0; r < GH; r++) {
        for (let c = 0; c < GW; c++) {
          const val = grid[r * GW + c]
          const gray = Math.round((1 - val) * 255)
          const x = c * cellW
          const y = r * cellH

          // Cell background
          g.append('rect')
            .attr('x', x).attr('y', y)
            .attr('width', cellW - 1).attr('height', cellH - 1)
            .attr('fill', `rgb(${gray},${gray},${gray})`)

          // Highlight stencil
          const dr = r - hoverR, dc = c - hoverC
          const isCenter = dr === 0 && dc === 0
          const isCardinal = (Math.abs(dr) + Math.abs(dc) === 1)

          if (isCenter) {
            g.append('rect')
              .attr('x', x).attr('y', y)
              .attr('width', cellW - 1).attr('height', cellH - 1)
              .attr('fill', 'none')
              .attr('stroke', '#000')
              .attr('stroke-width', 2)

            g.append('text')
              .attr('class', 'cell-text')
              .attr('x', x + 2).attr('y', y + cellH - 4)
              .style('font-family', 'SF Mono, Menlo, monospace')
              .style('font-size', '8pt')
              .attr('fill', '#000')
              .text('−4')
          } else if (isCardinal) {
            g.append('rect')
              .attr('x', x).attr('y', y)
              .attr('width', cellW - 1).attr('height', cellH - 1)
              .attr('fill', 'none')
              .attr('stroke', '#000')
              .attr('stroke-width', 1.5)

            g.append('text')
              .attr('class', 'cell-text')
              .attr('x', x + 2).attr('y', y + cellH - 4)
              .style('font-family', 'SF Mono, Menlo, monospace')
              .style('font-size', '8pt')
              .attr('fill', '#000')
              .text('+1')
          }
        }
      }

      // Compute and display Laplacian at hover
      const ci = hoverR * GW + hoverC
      const idx = (r, c) => {
        const rr = ((r%GH)+GH)%GH, cc = ((c%GW)+GW)%GW
        return rr * GW + cc
      }
      const lap = grid[idx(hoverR-1,hoverC)] + grid[idx(hoverR+1,hoverC)]
                + grid[idx(hoverR,hoverC-1)] + grid[idx(hoverR,hoverC+1)]
                - 4 * grid[ci]

      infoLabel.text(`cell (${hoverR},${hoverC}):  u=${grid[ci].toFixed(3)}  ∇²u=${lap.toFixed(3)}`)
    }

    // Add mousemove handler
    svg.on('mousemove', function(event) {
      const [mouseX, mouseY] = d3.pointer(event, g.node())
      const c = Math.floor(mouseX / cellW)
      const r = Math.floor(mouseY / cellH)
      if (r >= 0 && r < GH && c >= 0 && c < GW) {
        hoverR = r; hoverC = c
        draw()
      }
    })

    draw()

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
