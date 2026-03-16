/**
 * Step 19: Extending to 2D: Row-Major Layout
 */
import * as d3 from 'd3'

export default {
  title: 'Extending to 2D: Row-Major Layout',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Grid Layout</h3>
<p>A 2D W×H grid is stored as a flat 1D array of length W×H.</p>
<div class="math-block">$$\\text{index}(r, c) = r \\times W + c$$</div>
<p>This row-major layout is cache-friendly for row-by-row access patterns.</p></div>`,

  code: `<div class="code-section"><h3>Row-Major Storage</h3>
<pre><code class="language-js">// 2D grid stored as flat 1D Float32Array (row-major)
const W = 256, H = 256
const grid = new Float32Array(W * H)

// Access cell at row r, column c:
function idx(r, c) { return r * W + c }

// Row-major: row 0 is cells 0..255, row 1 is 256..511, etc.
// Cache-friendly: iterating row-by-row reads contiguous memory
for (let r = 0; r < H; r++) {
  for (let c = 0; c < W; c++) {
    grid[idx(r, c)] = 1.0  // fills rows contiguously
  }
}
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; text-align:center; overflow-y:auto; height:100%'

    // Create title
    const title = document.createElement('h3')
    title.textContent = '2D Row-Major Layout'
    title.style.cssText = 'margin-bottom:20px; font-family:SF Mono,monospace'
    div.appendChild(title)

    // Create SVG container
    const svg = d3.select(div)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', 600)
      .attr('height', 300)
      .style('display', 'block')
      .style('margin', '0 auto')

    // Grid parameters
    const gridW = 6, gridH = 5
    const cellSize = 35
    const gridStartX = 50
    const gridStartY = 50

    // Draw 2D grid
    for (let row = 0; row < gridH; row++) {
      for (let col = 0; col < gridW; col++) {
        const x = gridStartX + col * cellSize
        const y = gridStartY + row * cellSize

        // Draw cell rectangle
        const cell = svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', '#e0e0e0')
          .attr('stroke', '#999')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')

        // Add row,col label
        svg.append('text')
          .attr('x', x + cellSize / 2)
          .attr('y', y + cellSize / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'SF Mono, monospace')
          .attr('font-size', '10px')
          .text(`${row},${col}`)

        // Calculate flat array index
        const flatIndex = row * gridW + col

        // Hover behavior
        cell
          .on('mouseover', function() {
            // Highlight cell
            d3.select(this).attr('fill', '#74c0fc')

            // Highlight corresponding flat array cell
            d3.select(`#flat-cell-${flatIndex}`)
              .attr('fill', '#74c0fc')

            // Update formula display
            d3.select('#formula-display')
              .text(`idx(${row}, ${col}) = ${row} × ${gridW} + ${col} = ${flatIndex}`)
          })
          .on('mouseout', function() {
            // Reset cell
            d3.select(this).attr('fill', '#e0e0e0')

            // Reset flat array cell
            d3.select(`#flat-cell-${flatIndex}`)
              .attr('fill', '#f0f0f0')

            // Reset formula display
            d3.select('#formula-display')
              .text('idx(row, col) = row × W + col')
          })
      }
    }

    // Draw flat array representation
    const flatStartY = 200
    const flatCellSize = 18
    const totalCells = gridW * gridH

    for (let i = 0; i < totalCells; i++) {
      const x = gridStartX + (i % 15) * flatCellSize  // Wrap at 15 cells
      const y = flatStartY + Math.floor(i / 15) * flatCellSize

      svg.append('rect')
        .attr('id', `flat-cell-${i}`)
        .attr('x', x)
        .attr('y', y)
        .attr('width', flatCellSize)
        .attr('height', flatCellSize)
        .attr('fill', '#f0f0f0')
        .attr('stroke', '#999')
        .attr('stroke-width', 0.5)

      // Add index label
      svg.append('text')
        .attr('x', x + flatCellSize / 2)
        .attr('y', y + flatCellSize / 2 + 3)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'SF Mono, monospace')
        .attr('font-size', '7px')
        .text(i)
    }

    // Add labels
    svg.append('text')
      .attr('x', gridStartX + (gridW * cellSize) / 2)
      .attr('y', gridStartY - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('2D Grid (hover cells)')

    svg.append('text')
      .attr('x', gridStartX + 7.5 * flatCellSize)
      .attr('y', flatStartY - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Flat Array (row-major)')

    // Formula display
    svg.append('text')
      .attr('id', 'formula-display')
      .attr('x', 300)
      .attr('y', 280)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('idx(row, col) = row × W + col')

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
