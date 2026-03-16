/**
 * Step 50: Preset: Stripes (f=0.060, k=0.062)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Stripes (f=0.060, k=0.062)',
  chapter: 5,

  math: `<div class="math-section"><h3>Stripes Pattern</h3>
<p>f=0.060, k=0.062: Produces labyrinthine stripe patterns. Similar to zebra stripes or coral brain patterns.
The stripes form with a characteristic wavelength determined by Du/Dv.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Stripes preset — labyrinthine Turing pattern
const stripes = { f: 0.060, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.060: higher feed than spots — V can sustain connected domains
// k=0.062: similar kill rate — but extra U supply changes topology
// Result: connected labyrinthine stripes (no isolated spots)
// Near boundary with spots: mixed patterns possible
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['stripes'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
