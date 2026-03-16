/**
 * Step 20: 2D Index Arithmetic
 */
import * as d3 from 'd3'

export default {
  title: '2D Index Arithmetic',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Index with Periodic Wrap</h3>
<div class="math-block">$$\\text{idx}(r,c) = \\bigl((r \\bmod H) + H\\bigr)\\bmod H \\times W + \\bigl((c \\bmod W) + W\\bigr)\\bmod W$$</div>
<p>The double-modulo pattern handles negative indices correctly in JavaScript.</p></div>`,

  code: `<div class="code-section"><h3>Index Wrap Arithmetic</h3>
<pre><code class="language-js">// JavaScript % returns negative for negative inputs:
// -1 % 5 === -1  (WRONG for wrapping)

// Safe periodic wrap — double modulo:
function wrap(i, N) { return ((i % N) + N) % N }

// 2D periodic index:
function idx2D(r, c, W, H) {
  return wrap(r, H) * W + wrap(c, W)
}

// Example: idx2D(-1, 3, 5, 5) → wrap(-1,5)=4, wrap(3,5)=3 → 4*5+3 = 23
// GLSL mod() handles negatives correctly — this fix is JS-only
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; text-align:center; overflow-y:auto; height:100%'

    // Create title
    const title = document.createElement('h3')
    title.textContent = '2D Index Arithmetic with Wrapping'
    title.style.cssText = 'margin-bottom:20px; font-family:SF Mono,monospace'
    div.appendChild(title)

    // Create SVG container
    const svg = d3.select(div)
      .append('svg')
      .attr('id', 'd3-sim')
      .attr('width', 600)
      .attr('height', 400)
      .style('display', 'block')
      .style('margin', '0 auto')

    // Grid parameters for main 5x5 grid
    const gridSize = 5
    const cellSize = 30
    const gridStartX = 200
    const gridStartY = 100

    // Draw the extended 7x7 display area showing wrapping
    for (let row = -1; row <= gridSize; row++) {
      for (let col = -1; col <= gridSize; col++) {
        const x = gridStartX + col * cellSize
        const y = gridStartY + row * cellSize

        // Determine if this is inside the main 5x5 grid
        const isInner = (row >= 0 && row < gridSize && col >= 0 && col < gridSize)

        // Calculate wrapped coordinates
        const wrappedRow = ((row % gridSize) + gridSize) % gridSize
        const wrappedCol = ((col % gridSize) + gridSize) % gridSize

        // Draw cell
        const cell = svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', isInner ? '#e0e0e0' : '#f8f8f8')
          .attr('stroke', '#999')
          .attr('stroke-width', isInner ? 1 : 0.5)
          .style('cursor', isInner ? 'pointer' : 'default')

        // Add coordinate labels
        svg.append('text')
          .attr('x', x + cellSize / 2)
          .attr('y', y + cellSize / 2 - 2)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'SF Mono, monospace')
          .attr('font-size', '8px')
          .attr('fill', isInner ? '#000' : '#666')
          .text(`${row},${col}`)

        // Add wrapped coordinates for outer cells
        if (!isInner) {
          svg.append('text')
            .attr('x', x + cellSize / 2)
            .attr('y', y + cellSize / 2 + 8)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'SF Mono, monospace')
            .attr('font-size', '7px')
            .attr('fill', '#999')
            .text(`→${wrappedRow},${wrappedCol}`)
        }

        // Hover behavior for inner cells
        if (isInner) {
          cell
            .on('mouseover', function() {
              d3.select(this).attr('fill', '#74c0fc')

              // Show calculation
              const idx = wrappedRow * gridSize + wrappedCol
              d3.select('#calculation-display')
                .text(`idx2D(${row}, ${col}, ${gridSize}, ${gridSize}) = wrap(${row},${gridSize}) × ${gridSize} + wrap(${col},${gridSize}) = ${wrappedRow} × ${gridSize} + ${wrappedCol} = ${idx}`)
            })
            .on('mouseout', function() {
              d3.select(this).attr('fill', '#e0e0e0')
              d3.select('#calculation-display')
                .text('Hover inner cells to see index calculation')
            })
        }
      }
    }

    // Draw number line showing modulo behavior
    const numberLineY = 320
    const numberLineX = 150
    const numberSpacing = 20

    // Draw number line from -2 to 6 for N=5
    for (let i = -2; i <= 6; i++) {
      const x = numberLineX + (i + 2) * numberSpacing

      // Draw tick
      svg.append('line')
        .attr('x1', x)
        .attr('y1', numberLineY - 5)
        .attr('x2', x)
        .attr('y2', numberLineY + 5)
        .attr('stroke', '#999')
        .attr('stroke-width', 1)

      // Add number label
      svg.append('text')
        .attr('x', x)
        .attr('y', numberLineY + 18)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'SF Mono, monospace')
        .attr('font-size', '10px')
        .text(i)

      // Add wrapped value for negatives and >= N
      if (i < 0 || i >= 5) {
        const wrapped = ((i % 5) + 5) % 5
        svg.append('text')
          .attr('x', x)
          .attr('y', numberLineY - 15)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'SF Mono, monospace')
          .attr('font-size', '8px')
          .attr('fill', '#cc0000')
          .text(wrapped)
      }
    }

    // Number line arrows showing wrap
    // -1 → 4
    svg.append('path')
      .attr('d', `M ${numberLineX + numberSpacing} ${numberLineY - 25}
                  Q ${numberLineX + 3.5 * numberSpacing} ${numberLineY - 35}
                  ${numberLineX + 6 * numberSpacing} ${numberLineY - 25}`)
      .attr('fill', 'none')
      .attr('stroke', '#cc0000')
      .attr('stroke-width', 1)
      .attr('marker-end', 'url(#arrowhead)')

    // 5 → 0
    svg.append('path')
      .attr('d', `M ${numberLineX + 7 * numberSpacing} ${numberLineY - 25}
                  Q ${numberLineX + 4.5 * numberSpacing} ${numberLineY - 35}
                  ${numberLineX + 2 * numberSpacing} ${numberLineY - 25}`)
      .attr('fill', 'none')
      .attr('stroke', '#cc0000')
      .attr('stroke-width', 1)
      .attr('marker-end', 'url(#arrowhead)')

    // Arrow marker definition
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 3 L 0 6 z')
      .attr('fill', '#cc0000')

    // Add labels
    svg.append('text')
      .attr('x', gridStartX + (gridSize * cellSize) / 2)
      .attr('y', gridStartY - 15)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('5×5 Grid with Wrap-Around Neighbors')

    svg.append('text')
      .attr('x', numberLineX + 4 * numberSpacing)
      .attr('y', numberLineY - 45)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text('Modulo Wrapping (N=5)')

    // Calculation display
    svg.append('text')
      .attr('id', 'calculation-display')
      .attr('x', 300)
      .attr('y', 380)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'SF Mono, monospace')
      .attr('font-size', '12px')
      .text('Hover inner cells to see index calculation')

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
