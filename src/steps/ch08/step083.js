/**
 * Step 83: Spatially Varying f and k: Parameter Maps
 */
import * as d3 from 'd3'
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Spatially Varying f and k: Parameter Maps',
  chapter: 8,

  math: `<div class="math-section"><h3>Spatially Varying Parameters</h3>
<p>Store f(x,y) and k(x,y) as textures. The simulation shader samples these textures
alongside the state texture, allowing gradients and boundaries in parameter space.</p>
<p>Different regions produce different pattern types: spots in one zone, stripes in another.</p></div>`,

  code: `<div class="code-section"><h3>Parameter Map GLSL</h3>
<pre><code class="language-js">uniform sampler2D u_fMap;  // f(x,y) parameter texture
uniform sampler2D u_kMap;  // k(x,y) parameter texture

void main() {
  // Sample spatially varying parameters
  float f_local = texture(u_fMap, v_uv).r;
  float k_local = texture(u_kMap, v_uv).r;

  // Use in Gray-Scott equations
  float dudt = Du*lapU - uvv + f_local*(1.0 - u);
  float dvdt = Dv*lapV + uvv - (f_local + k_local)*v;

  // Different (f,k) → different patterns
}
</code></pre></div>`,

  init(container, state) {
    // Create container with D3 parameter map diagram above GPU sim
    const diagDiv = document.createElement('div')
    diagDiv.style.cssText = 'text-align: center; margin-bottom: 10px'
    container.appendChild(diagDiv)

    // D3 parameter map visualization
    const S = 200
    const svg = d3.select(diagDiv).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S/2)
      .style('display', 'block').style('margin', '0 auto 10px')

    const g = svg.append('g')

    // Draw parameter zones
    const zones = [
      { x: 0, y: 0, w: S/2, h: S/2, color: '#3b82f6', label: 'f=0.037, k=0.06\n(spots)' },
      { x: S/2, y: 0, w: S/2, h: S/2, color: '#dc2626', label: 'f=0.078, k=0.061\n(stripes)' }
    ]

    zones.forEach(zone => {
      g.append('rect')
        .attr('x', zone.x).attr('y', zone.y)
        .attr('width', zone.w).attr('height', zone.h)
        .attr('fill', zone.color)
        .attr('fill-opacity', 0.3)
        .attr('stroke', zone.color)
        .attr('stroke-width', 2)

      g.append('text')
        .attr('x', zone.x + zone.w/2).attr('y', zone.y + zone.h/2 - 5)
        .attr('text-anchor', 'middle')
        .style('font-family', 'SF Mono, monospace').style('font-size', '8pt')
        .style('fill', zone.color)
        .text(zone.label.split('\n')[0])

      g.append('text')
        .attr('x', zone.x + zone.w/2).attr('y', zone.y + zone.h/2 + 8)
        .attr('text-anchor', 'middle')
        .style('font-family', 'SF Mono, monospace').style('font-size', '8pt')
        .style('fill', zone.color)
        .text(zone.label.split('\n')[1])
    })

    // Border
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', S).attr('height', S/2)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 1)

    g.append('text')
      .attr('x', S/2).attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace').style('font-size', '10pt')
      .style('font-weight', 'bold')
      .text('Parameter Map f(x,y), k(x,y)')

    // GPU simulation
    const cleanup = startGPULoop(container, {
      params: { ...PRESETS['coral'] }, // Complex preset shows varied patterns
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
