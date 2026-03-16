/**
 * Step 49: Preset: Spots (f=0.035, k=0.065)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Spots (f=0.035, k=0.065)',
  chapter: 5,

  math: `<div class="math-section"><h3>Spots Pattern</h3>
<p>f=0.035, k=0.065: Produces isolated circular spots (similar to leopard spots).
This is perhaps the most visually striking and stable pattern type.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Spots preset — classic Turing pattern
const spots = { f: 0.035, k: 0.065, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.035: low feed — just enough to sustain V but not flood
// k=0.065: high kill — prevents V from spreading past spot boundaries
// Result: isolated V-rich circles on a U-rich background
// Biological analogue: leopard spots, zebrafish pigment cells

// Pattern formation time: ~3000-5000 sim-time-units from center seed
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
