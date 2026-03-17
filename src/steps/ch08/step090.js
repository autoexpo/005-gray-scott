/**
 * Step 90: Coupling Two Gray-Scott Layers
 */
import * as d3 from 'd3'
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Coupling Two Gray-Scott Layers',
  chapter: 8,

  math: `<div class="math-section"><h3>Two-Layer Coupling</h3>
<p>Run two independent Gray-Scott systems and weakly couple them:
$u_1$ is influenced by $u_2$ and vice versa. The coupled system can produce
patterns impossible in a single layer.</p></div>`,

  code: `<div class="code-section"><h3>Coupled Layer Equations</h3>
<pre><code class="language-js">// Layer 1 equations with coupling to layer 2
du₁/dt = Du₁∇²u₁ - u₁v₁² + f₁(1-u₁) + γ(u₂-u₁)
dv₁/dt = Dv₁∇²v₁ + u₁v₁² - (f₁+k₁)v₁

// Layer 2 equations with coupling to layer 1
du₂/dt = Du₂∇²u₂ - u₂v₂² + f₂(1-u₂) + γ(u₁-u₂)
dv₂/dt = Dv₂∇²v₂ + u₂v₂² - (f₂+k₂)v₂

// γ = coupling strength (0.01 typical)
// Different (f₁,k₁) and (f₂,k₂) create layer diversity
</code></pre></div>`,

  init(container, state) {
    // Create container with D3 coupling diagram above GPU sim
    const diagDiv = document.createElement('div')
    diagDiv.style.cssText = 'text-align: center; margin-bottom: 10px'
    container.appendChild(diagDiv)

    // Rich text panel explaining the coupling concept
    const textDiv = document.createElement('div')
    textDiv.id = 'text-panel'
    textDiv.style.cssText = 'padding:15px; font-family:SF Mono,monospace; font-size:9pt; line-height:1.5; max-width:600px; margin:0 auto; background:#f8f8f8; border-radius:4px'

    textDiv.innerHTML = `
      <h4>Coupled Layer Dynamics</h4>

      <table style="border-collapse:collapse; margin:10px 0; font-size:8pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#fff">
          <th style="text-align:left; padding:4px">Layer</th>
          <th style="text-align:left; padding:4px">Parameters</th>
          <th style="text-align:left; padding:4px">Pattern Type</th>
          <th style="text-align:left; padding:4px">Coupling Effect</th>
        </tr>
        <tr><td style="padding:4px">Layer 1</td><td style="padding:4px">f₁=0.037, k₁=0.06</td><td style="padding:4px">Spots</td><td style="padding:4px">Inhibited by layer 2</td></tr>
        <tr><td style="padding:4px">Layer 2</td><td style="padding:4px">f₂=0.078, k₂=0.061</td><td style="padding:4px">Stripes</td><td style="padding:4px">Enhanced by layer 1</td></tr>
      </table>

      <pre style="font-size:8pt; line-height:1.2; color:#666; margin:10px 0">
        Coupling Diagram:

        Layer 1: ●─●─●     Layer 2: ═══════
                 │ │ │               ║   ║
          γ(u₂-u₁)↕ ↕ ↕γ(u₁-u₂)    ║   ║
                 │ │ │               ║   ║
        Result:  ●═●═●               ◊═══◊

        • Spots from layer 1 organize stripes in layer 2
        • Stripes from layer 2 stabilize spots in layer 1
        • Hybrid patterns emerge: spot-stripe composites
      </pre>

      <p><strong>Applications:</strong> Multi-scale biological patterns, layered material designs, coupled chemical oscillators</p>
    `

    diagDiv.appendChild(textDiv)

    // GPU simulation below showing complex patterns
    const cleanup = startGPULoop(container, {
      params: { ...PRESETS['coral'] }, // Complex preset suggests multi-layer effects
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })

    return () => {
      cleanup()
      container.innerHTML = ''
    }
  }
}
