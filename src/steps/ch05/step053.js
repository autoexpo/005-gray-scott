/**
 * Step 53: Preset: Bubbles (f=0.098, k=0.057)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Bubbles (f=0.098, k=0.057)',
  chapter: 5,

  math: `<div class="math-section"><h3>Bubbles Pattern</h3>
<p>f=0.098, k=0.057: Large bubble-like domains expanding outward.
High feed rate means V is well-supplied and forms macroscopic structures.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">const bubbles = { f: 0.098, k: 0.057, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.098: very high feed — U constantly replenished
// k=0.057: moderate kill — V grows but can't completely escape
// Result: large V-filled domains compete for space
// Coarsening: small bubbles shrink, large ones grow (Ostwald ripening)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['bubbles'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
