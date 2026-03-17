/**
 * Step 37: Fragment Shader: Neighbour Sampling
 */
import * as d3 from 'd3'

export default {
  title: 'Fragment Shader: Neighbour Sampling',
  chapter: 4,

  math: `<div class="math-section"><h3>Sampling Neighbours</h3>
<p>In GLSL, texture2D(sampler, uv + offset) reads the value at a neighbouring texel.
With RepeatWrapping, this automatically handles periodic boundary conditions.</p></div>`,

  code: `<div class="code-section"><h3>Offset Calculation</h3>
<pre><code class="language-js">// For a 512×512 texture, each texel is 1/512 of UV space
uniform float u_texelSize;  // 1.0 / 512.0

// In fragment shader:
vec2 offset = vec2(u_texelSize, 0.0);
vec2 offsetY = vec2(0.0, u_texelSize);

// Sample the 4 cardinal neighbors
vec2 left   = texture(u_texture, v_uv - offset);
vec2 right  = texture(u_texture, v_uv + offset);
vec2 down   = texture(u_texture, v_uv - offsetY);
vec2 up     = texture(u_texture, v_uv + offsetY);
</code></pre></div>`,

  init(container, state) {
    const S = 400
    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g').attr('transform', `translate(${S/2}, ${S/2})`)

    const cellSize = 40
    const gridSize = 3

    // Draw 3×3 grid
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const x = i * cellSize, y = j * cellSize
        const isCenter = (i === 0 && j === 0)
        const isCardinal = (i === 0 || j === 0) && !isCenter

        const rect = g.append('rect')
          .attr('x', x - cellSize/2)
          .attr('y', y - cellSize/2)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('stroke', '#333')
          .attr('stroke-width', 1)

        if (isCenter) {
          rect.attr('fill', '#2563eb').attr('stroke-width', 3)
          g.append('text')
            .attr('x', x).attr('y', y + 5)
            .attr('text-anchor', 'middle')
            .style('font-family', 'SF Mono, monospace')
            .style('font-size', '12pt')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('CENTER')
        } else if (isCardinal) {
          rect.attr('fill', '#dc2626')

          let label = ''
          if (i === -1 && j === 0) label = 'LEFT'
          else if (i === 1 && j === 0) label = 'RIGHT'
          else if (i === 0 && j === -1) label = 'UP'
          else if (i === 0 && j === 1) label = 'DOWN'

          g.append('text')
            .attr('x', x).attr('y', y + 5)
            .attr('text-anchor', 'middle')
            .style('font-family', 'SF Mono, monospace')
            .style('font-size', '9pt')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text(label)
        } else {
          rect.attr('fill', '#f3f4f6')
          g.append('text')
            .attr('x', x).attr('y', y + 5)
            .attr('text-anchor', 'middle')
            .style('font-family', 'SF Mono, monospace')
            .style('font-size', '8pt')
            .style('fill', '#666')
            .text('unused')
        }
      }
    }

    // Add UV coordinate labels
    g.append('text')
      .attr('x', 0).attr('y', -80)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')
      .text('5-Point Stencil')

    // Add arrows and offset labels
    const arrowLength = 20
    const arrowStyle = { stroke: '#333', 'stroke-width': 2, 'marker-end': 'url(#arrow)' }

    // Define arrow marker
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#333')

    // Offset annotations
    g.append('text')
      .attr('x', -cellSize - 10).attr('y', -5)
      .attr('text-anchor', 'end')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt')
      .style('fill', '#666')
      .text('v_uv - vec2(texelSize, 0)')

    g.append('text')
      .attr('x', cellSize + 10).attr('y', -5)
      .attr('text-anchor', 'start')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt')
      .style('fill', '#666')
      .text('v_uv + vec2(texelSize, 0)')

    g.append('text')
      .attr('x', 5).attr('y', -cellSize - 10)
      .attr('text-anchor', 'start')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt')
      .style('fill', '#666')
      .text('v_uv - vec2(0, texelSize)')

    g.append('text')
      .attr('x', 5).attr('y', cellSize + 20)
      .attr('text-anchor', 'start')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt')
      .style('fill', '#666')
      .text('v_uv + vec2(0, texelSize)')

    return () => {
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
