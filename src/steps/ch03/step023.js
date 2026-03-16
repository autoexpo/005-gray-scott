/**
 * Step 23: Initial Conditions for 2D
 */
import * as d3 from 'd3'

export default {
  title: 'Initial Conditions for 2D',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Initial Conditions</h3>
<p>Standard: U=1 everywhere, V=0 everywhere, with a small central square of V=1, U=0.
The square size controls how many "seeds" develop.</p></div>`,

  code: `<div class="code-section"><h3>2D Initial Conditions Code</h3>
<pre><code class="language-js">// Standard 2D Gray-Scott initial conditions
const W = 256, H = 256
const u = new Float32Array(W * H).fill(1.0)  // u=1 everywhere
const v = new Float32Array(W * H).fill(0.0)  // v=0 everywhere

// Seed: center 16×16 patch with u=0, v=1
const cx = W / 2, cy = H / 2, r = 8
for (let row = cy - r; row < cy + r; row++) {
  for (let col = cx - r; col < cx + r; col++) {
    u[row * W + col] = 0.0
    v[row * W + col] = 1.0
  }
}
// Without this seed, u·v² = 0 everywhere → reaction never starts
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; text-align:center; overflow-y:auto; height:100%'

    // Create title
    const title = document.createElement('h3')
    title.textContent = '2D Initial Conditions'
    title.style.cssText = 'margin-bottom:20px; font-family:SF Mono,monospace'
    div.appendChild(title)

    // Create SVG container
    const svg = d3.select(div)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', 400)
      .attr('height', 300)
      .style('display', 'block')
      .style('margin', '0 auto')

    // Grid parameters
    const gridSize = 10
    const cellSize = 20
    const startX = 100
    const startY = 50

    // Draw grid cells
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize
        const y = startY + row * cellSize

        // Determine if this is part of the center seed (2x2 block in middle)
        const isCenter = (row >= 4 && row <= 5) && (col >= 4 && col <= 5)
        const fillColor = isCenter ? '#2c2c2c' : '#e0e0e0'

        // Draw cell rectangle
        svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', fillColor)
          .attr('stroke', '#999')
          .attr('stroke-width', 1)
      }
    }

    // Add legend
    const legend = svg.append('g')
      .attr('transform', 'translate(50, 270)')

    // Light gray square for u=1, v=0
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#e0e0e0')
      .attr('stroke', '#999')

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .text('u=1, v=0 (everywhere)')

    // Dark square for center seed
    legend.append('rect')
      .attr('x', 180)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#2c2c2c')
      .attr('stroke', '#999')

    legend.append('text')
      .attr('x', 200)
      .attr('y', 12)
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .text('u=0, v=1 (center seed)')

    // Add description
    const description = div.appendChild(document.createElement('div'))
    description.style.cssText = 'margin-top:20px; font-family:SF Mono,monospace; font-size:11pt; max-width:500px; margin-left:auto; margin-right:auto'
    description.innerHTML = 'Initial state: u=1, v=0. Center seed: u=0, v=1'

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
