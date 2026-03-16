/**
 * Step 27: The 9-Point Isotropic Laplacian
 */
import * as d3 from 'd3'

export default {
  title: 'The 9-Point Isotropic Laplacian',
  chapter: 3,

  math: `
<div class="math-section">
  <h3>5-Point Stencil Anisotropy</h3>
  <p>The standard 5-point finite difference stencil has directional bias:</p>
  <div class="math-block">$$\\nabla^2 u \\approx \\frac{1}{h^2}(u_{i+1,j} + u_{i-1,j} + u_{i,j+1} + u_{i,j-1} - 4u_{i,j})$$</div>
  <p>This samples only cardinal directions, leading to anisotropy in diagonal directions.</p>
</div>
<div class="math-section">
  <h3>9-Point Isotropic Stencil</h3>
  <p>The isotropic 9-point stencil includes diagonal neighbors:</p>
  <div class="math-block">$$\\nabla^2 u \\approx \\frac{1}{6h^2} \\begin{bmatrix}
  \\frac{1}{2} & 1 & \\frac{1}{2} \\\\
  1 & -10 & 1 \\\\
  \\frac{1}{2} & 1 & \\frac{1}{2}
  \\end{bmatrix} * u$$</div>
  <p>Weights: center = -10/6, cardinal = 1, diagonal = 1/2</p>
</div>
<div class="math-section">
  <h3>Rotational Symmetry</h3>
  <p>The 9-point stencil has rotational symmetry, reducing angular error from ~30% to <1%:</p>
  <div class="math-block">$$\\text{Error}_{\\text{5pt}}(\\theta) \\approx 0.3 \\sin^2(2\\theta)$$</div>
  <div class="math-block">$$\\text{Error}_{\\text{9pt}}(\\theta) \\approx 0.01 \\sin^4(2\\theta)$$</div>
  <p>The 9-point stencil is O(h⁴) accurate vs O(h²) for 5-point.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>GLSL Implementation</h3>
  <div class="filename">Fragment shader texture sampling</div>
<pre><code class="language-glsl">// 5-point Laplacian
vec4 sample5pt(sampler2D tex, vec2 uv, vec2 texel) {
  return texture(tex, uv + vec2(-texel.x, 0.0)) +
         texture(tex, uv + vec2( texel.x, 0.0)) +
         texture(tex, uv + vec2(0.0, -texel.y)) +
         texture(tex, uv + vec2(0.0,  texel.y)) -
         4.0 * texture(tex, uv);
}

// 9-point isotropic Laplacian
vec4 sample9pt(sampler2D tex, vec2 uv, vec2 texel) {
  const float w1 = 1.0/6.0;     // cardinal weight
  const float w2 = 1.0/12.0;    // diagonal weight
  const float wc = 5.0/3.0;     // center weight

  return w1 * (texture(tex, uv + vec2(-texel.x, 0.0)) +
               texture(tex, uv + vec2( texel.x, 0.0)) +
               texture(tex, uv + vec2(0.0, -texel.y)) +
               texture(tex, uv + vec2(0.0,  texel.y))) +
         w2 * (texture(tex, uv + texel * vec2(-1,-1)) +
               texture(tex, uv + texel * vec2( 1,-1)) +
               texture(tex, uv + texel * vec2(-1, 1)) +
               texture(tex, uv + texel * vec2( 1, 1))) -
         wc * texture(tex, uv);
}
</code></pre>
</div>
<div class="code-section">
  <h3>JavaScript CPU Implementation</h3>
  <div class="filename">9-point stencil for CPU simulation</div>
<pre><code class="language-js">function laplacian9pt(u, r, c, N) {
  const w1 = 1/6, w2 = 1/12, wc = 5/3

  const rp = (r+1) % N, rm = (r-1+N) % N
  const cp = (c+1) % N, cm = (c-1+N) % N

  return w1 * (u[rp*N+c] + u[rm*N+c] + u[r*N+cp] + u[r*N+cm]) +
         w2 * (u[rp*N+cp] + u[rp*N+cm] + u[rm*N+cp] + u[rm*N+cm]) -
         wc * u[r*N+c]
}
</code></pre>
</div>
`,

  init(container) {
    const S = 500
    const margin = 40
    const stencilSize = 200

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', 300)
      .style('display', 'block').style('margin', '20px auto')

    // 5-point stencil (left)
    const g1 = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`)

    g1.append('text')
      .attr('x', stencilSize/2).attr('y', -10)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '12pt').style('font-weight', 'bold')
      .attr('text-anchor', 'middle').attr('fill', '#000')
      .text('5-Point Stencil')

    // Create 3x3 grid for 5-point
    const cellSize = stencilSize / 3
    const weights5pt = [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ]

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const w = weights5pt[r][c]
        const x = c * cellSize
        const y = r * cellSize

        let fillColor = '#fff'
        if (w === -4) fillColor = '#333'
        else if (w === 1) fillColor = '#999'

        g1.append('rect')
          .attr('x', x).attr('y', y)
          .attr('width', cellSize).attr('height', cellSize)
          .attr('fill', fillColor)
          .attr('stroke', '#000').attr('stroke-width', 1)

        if (w !== 0) {
          g1.append('text')
            .attr('x', x + cellSize/2).attr('y', y + cellSize/2 + 5)
            .style('font-family', 'SF Mono, Menlo, monospace')
            .style('font-size', '14pt').style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('fill', w === -4 ? '#fff' : '#000')
            .text(w.toString())
        }
      }
    }

    // 9-point stencil (right)
    const g2 = svg.append('g')
      .attr('transform', `translate(${margin + stencilSize + 60}, ${margin})`)

    g2.append('text')
      .attr('x', stencilSize/2).attr('y', -10)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '12pt').style('font-weight', 'bold')
      .attr('text-anchor', 'middle').attr('fill', '#000')
      .text('9-Point Isotropic')

    // Create 3x3 grid for 9-point
    const weights9pt = [
      [1/12, 1/6, 1/12],
      [1/6, -5/3, 1/6],
      [1/12, 1/6, 1/12]
    ]
    const labels9pt = [
      ['1/12', '1/6', '1/12'],
      ['1/6', '-5/3', '1/6'],
      ['1/12', '1/6', '1/12']
    ]

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const w = weights9pt[r][c]
        const x = c * cellSize
        const y = r * cellSize

        let fillColor = '#fff'
        if (r === 1 && c === 1) fillColor = '#333'  // center
        else if ((r === 1 && c !== 1) || (r !== 1 && c === 1)) fillColor = '#999'  // cardinal
        else fillColor = '#ccc'  // diagonal

        g2.append('rect')
          .attr('x', x).attr('y', y)
          .attr('width', cellSize).attr('height', cellSize)
          .attr('fill', fillColor)
          .attr('stroke', '#000').attr('stroke-width', 1)

        g2.append('text')
          .attr('x', x + cellSize/2).attr('y', y + cellSize/2 + 5)
          .style('font-family', 'SF Mono, Menlo, monospace')
          .style('font-size', '10pt').style('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('fill', (r === 1 && c === 1) ? '#fff' : '#000')
          .text(labels9pt[r][c])
      }
    }

    return () => {
      container.innerHTML = ''
    }
  }
}
