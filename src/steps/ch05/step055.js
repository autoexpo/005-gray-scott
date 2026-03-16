/**
 * Step 55: Preset: Solitons (Traveling Pulses)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Solitons (Traveling Pulses)',
  chapter: 5,

  math: `<div class="math-section"><h3>Solitons</h3>
<p>f=0.030, k=0.057: Traveling wave pulses that maintain their shape.
"Soliton" because they pass through each other without dispersion.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">const solitons = { f: 0.030, k: 0.057, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.030: too low to sustain static patterns
// k=0.057: moderate kill — V forms traveling pulses
// Solitons: stable propagating waves that survive collisions
// 2D analogue of 1D traveling waves from chapter 2
// Speed ≈ 2√(Du·f) ≈ 0.16 cells/time-unit
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['solitons'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
