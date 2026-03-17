/**
 * Step 35: Full-Screen Quad Geometry
 */
import * as d3 from 'd3'

export default {
  title: 'Full-Screen Quad Geometry',
  chapter: 4,

  math: `<div class="math-section"><h3>Full-Screen Quad</h3>
<p>A GPU "compute" pass uses a quad covering the entire NDC space [-1,1]².
Each fragment corresponds to one texel of the output texture.
The fragment shader computes one cell's new state per invocation.</p></div>`,

  code: `<div class="code-section"><h3>Quad Vertices (NDC)</h3>
<pre><code class="language-js">// Two triangles forming a full-screen quad
const vertices = new Float32Array([
  // Triangle 1: bottom-left, bottom-right, top-left
  -1.0, -1.0,   // vertex 0
   1.0, -1.0,   // vertex 1
  -1.0,  1.0,   // vertex 2

  // Triangle 2: bottom-right, top-right, top-left
   1.0, -1.0,   // vertex 3
   1.0,  1.0,   // vertex 4
  -1.0,  1.0    // vertex 5
])

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
</code></pre></div>`,

  init(container, state) {
    const S = 400
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // NDC coordinate system: [-1,1] x [-1,1]
    const scale = Math.min(W, H) / 2
    const centerX = W / 2, centerY = H / 2

    // Draw coordinate system
    g.append('line')
      .attr('x1', centerX - scale).attr('y1', centerY)
      .attr('x2', centerX + scale).attr('y2', centerY)
      .attr('stroke', '#ccc').attr('stroke-width', 1)

    g.append('line')
      .attr('x1', centerX).attr('y1', centerY - scale)
      .attr('x2', centerX).attr('y2', centerY + scale)
      .attr('stroke', '#ccc').attr('stroke-width', 1)

    // Convert NDC to screen coordinates
    const toScreen = (ndcX, ndcY) => [
      centerX + ndcX * scale,
      centerY - ndcY * scale  // Y flipped for screen coords
    ]

    // Full-screen quad vertices
    const vertices = [
      [-1, -1], [1, -1], [-1, 1],  // Triangle 1
      [1, -1], [1, 1], [-1, 1]     // Triangle 2
    ]

    // Draw the quad outline
    const quadPath = [
      [-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]
    ].map(([x, y]) => toScreen(x, y))

    g.append('path')
      .attr('d', d3.line()(quadPath))
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)

    // Fill the quad lightly
    g.append('path')
      .attr('d', d3.line()(quadPath))
      .attr('fill', '#e3f2fd')
      .attr('fill-opacity', 0.3)

    // Draw vertices as points
    vertices.forEach(([x, y], i) => {
      const [sx, sy] = toScreen(x, y)
      g.append('circle')
        .attr('cx', sx).attr('cy', sy)
        .attr('r', 4)
        .attr('fill', '#1976d2')

      g.append('text')
        .attr('x', sx + (x > 0 ? 10 : -10))
        .attr('y', sy + (y > 0 ? -10 : 15))
        .attr('text-anchor', x > 0 ? 'start' : 'end')
        .style('font-family', 'SF Mono, monospace')
        .style('font-size', '9pt')
        .style('fill', '#1976d2')
        .text(`v${i} (${x},${y})`)
    })

    // Coordinate labels
    g.append('text')
      .attr('x', centerX + scale + 10).attr('y', centerY + 5)
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('fill', '#666')
      .text('+1')

    g.append('text')
      .attr('x', centerX - scale - 20).attr('y', centerY + 5)
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('fill', '#666')
      .text('−1')

    g.append('text')
      .attr('x', centerX - 5).attr('y', centerY - scale - 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('fill', '#666')
      .text('+1')

    g.append('text')
      .attr('x', centerX - 5).attr('y', centerY + scale + 20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('fill', '#666')
      .text('−1')

    // Title
    g.append('text')
      .attr('x', W/2).attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')
      .text('NDC Full-Screen Quad')

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
