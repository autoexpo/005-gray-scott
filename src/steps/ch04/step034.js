/**
 * Step 34: The Ping-Pong Pattern
 */
import * as d3 from 'd3'

export default {
  title: 'The Ping-Pong Pattern',
  chapter: 4,

  math: `<div class="math-section"><h3>Ping-Pong Pattern</h3>
<p>GPU shaders cannot read and write the same texture simultaneously.
Ping-pong uses two textures alternating as input/output each frame.</p>
<pre style="border:none;background:none;line-height:1.8">
  Frame N: read A → write B
  Frame N+1: read B → write A
  Frame N+2: read A → write B
  ...
</pre></div>`,

  code: `<div class="code-section"><h3>Ping-Pong Implementation</h3>
<pre><code class="language-js">class PingPong {
  constructor(gl, width, height) {
    this.fboA = createFBO(gl, width, height)
    this.fboB = createFBO(gl, width, height)
    this.isAFront = true  // A is read, B is written
  }

  swap() {
    this.isAFront = !this.isAFront
  }

  get readTexture() {
    return this.isAFront ? this.fboA.texture : this.fboB.texture
  }

  get writeFramebuffer() {
    return this.isAFront ? this.fboB.fbo : this.fboA.fbo
  }
}
</code></pre></div>`,

  init(container, state) {
    const S = 512
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create FBO representations
    const boxWidth = 120, boxHeight = 80
    const gap = W - 2 * boxWidth

    // FBO A
    const fboA = g.append('g').attr('transform', `translate(0, ${H/2 - boxHeight/2})`)
    fboA.append('rect')
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('fill', '#e3f2fd')
      .attr('stroke', '#1976d2')
      .attr('stroke-width', 2)

    fboA.append('text')
      .attr('x', boxWidth/2)
      .attr('y', boxHeight/2 - 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')
      .text('FBO A')

    const statusA = fboA.append('text')
      .attr('x', boxWidth/2)
      .attr('y', boxHeight/2 + 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')

    // FBO B
    const fboB = g.append('g').attr('transform', `translate(${boxWidth + gap}, ${H/2 - boxHeight/2})`)
    fboB.append('rect')
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('fill', '#fff3e0')
      .attr('stroke', '#f57c00')
      .attr('stroke-width', 2)

    fboB.append('text')
      .attr('x', boxWidth/2)
      .attr('y', boxHeight/2 - 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')
      .text('FBO B')

    const statusB = fboB.append('text')
      .attr('x', boxWidth/2)
      .attr('y', boxHeight/2 + 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')

    // Arrow
    const arrow = g.append('g').attr('transform', `translate(${boxWidth + 20}, ${H/2})`)

    arrow.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', gap - 40)
      .attr('y2', 0)
      .attr('stroke', '#666')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead)')

    // Define arrowhead marker
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('refX', 9)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', '#666')

    const arrowLabel = arrow.append('text')
      .attr('x', (gap - 40)/2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '12pt')
      .style('fill', '#666')

    // Frame counter
    const frameLabel = g.append('text')
      .attr('x', W/2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')

    // Animation state
    let frame = 0
    let animId

    function animate() {
      animId = requestAnimationFrame(animate)

      const isAFront = (frame % 2) === 0

      if (isAFront) {
        // A is read, B is written
        statusA.text('READ').style('fill', '#1976d2')
        statusB.text('WRITE').style('fill', '#f57c00')
        arrowLabel.text('A → B')

        // Highlight current read/write
        fboA.select('rect').attr('stroke-width', 3).attr('fill', '#bbdefb')
        fboB.select('rect').attr('stroke-width', 3).attr('fill', '#ffe0b2')
      } else {
        // B is read, A is written
        statusA.text('WRITE').style('fill', '#f57c00')
        statusB.text('READ').style('fill', '#1976d2')
        arrowLabel.text('B → A')

        // Highlight current read/write
        fboA.select('rect').attr('stroke-width', 3).attr('fill', '#ffe0b2')
        fboB.select('rect').attr('stroke-width', 3).attr('fill', '#bbdefb')
      }

      frameLabel.text(`Frame ${frame}`)

      // Advance frame every 60 animation frames (1 second)
      if (animId % 60 === 0) {
        frame++
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
