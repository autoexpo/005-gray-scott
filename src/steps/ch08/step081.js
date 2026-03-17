/**
 * Step 81: Anisotropic Diffusion Tensor
 */
import * as d3 from 'd3'
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Anisotropic Diffusion Tensor',
  chapter: 8,

  math: `<div class="math-section"><h3>Anisotropic Diffusion</h3>
<p>Replace the scalar Du, Dv with 2×2 diffusion tensors D:
$$\\nabla \\cdot (D \\nabla u)$$
This allows directional diffusion — patterns oriented along a preferred axis.</p>
<p>Example tensor: fast horizontal, slow vertical diffusion creates horizontal stripes.</p></div>`,

  code: `<div class="code-section"><h3>Tensor Diffusion GLSL</h3>
<pre><code class="language-js">// 2×2 diffusion tensor D = [Dxx Dxy]
//                             [Dyx Dyy]
uniform float u_Dxx, u_Dxy, u_Dyy;  // Dyx = Dxy (symmetric)

// Tensor-Laplacian: ∇·(D∇u) = Dxx*∂²u/∂x² + 2*Dxy*∂²u/∂x∂y + Dyy*∂²u/∂y²
vec2 tensorLaplacian(vec2 uv) {
  // Finite difference approximations
  vec2 dxx = (sample(uv+dx) - 2.0*sample(uv) + sample(uv-dx)) / (dx*dx);
  vec2 dyy = (sample(uv+dy) - 2.0*sample(uv) + sample(uv-dy)) / (dy*dy);

  // Cross derivative: ∂²u/∂x∂y ≈ mixed differences
  vec2 dxy = (sample(uv+dx+dy) - sample(uv+dx-dy) -
              sample(uv-dx+dy) + sample(uv-dx-dy)) / (4.0*dx*dy);

  return u_Dxx*dxx + 2.0*u_Dxy*dxy + u_Dyy*dyy;
}</code></pre></div>`,

  init(container, state) {
    // Create container with D3 diagram above GPU sim
    const diagDiv = document.createElement('div')
    diagDiv.style.cssText = 'text-align: center; margin-bottom: 10px'
    container.appendChild(diagDiv)

    // D3 tensor ellipse diagram
    const S = 200
    const svg = d3.select(diagDiv).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S/2)
      .style('display', 'block').style('margin', '0 auto 10px')

    const g = svg.append('g').attr('transform', `translate(${S/2}, ${S/4})`)

    // Draw tensor ellipse showing anisotropy
    g.append('ellipse')
      .attr('cx', 0).attr('cy', 0)
      .attr('rx', 40).attr('ry', 15)  // Wide ellipse = fast horizontal diffusion
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)

    // Axes
    g.append('line').attr('x1', -50).attr('x2', 50).attr('y1', 0).attr('y2', 0)
      .attr('stroke', '#ccc').attr('stroke-width', 1)
    g.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -25).attr('y2', 25)
      .attr('stroke', '#ccc').attr('stroke-width', 1)

    // Labels
    g.append('text').attr('x', 0).attr('y', -35).attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace').style('font-size', '10pt')
      .text('D = [0.4  0.0]')
    g.append('text').attr('x', 0).attr('y', -25).attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace').style('font-size', '10pt')
      .text('    [0.0  0.1]')

    g.append('text').attr('x', -60).attr('y', 5).style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt').style('fill', '#666').text('slow')
    g.append('text').attr('x', 25).attr('y', -5).style('font-family', 'SF Mono, monospace')
      .style('font-size', '8pt').style('fill', '#666').text('fast')

    // GPU simulation with stripes preset (shows directional patterns)
    const cleanup = startGPULoop(container, {
      params: { ...PRESETS['stripes'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })

    return () => {
      svg.remove()
      cleanup()
    }
  }
}
