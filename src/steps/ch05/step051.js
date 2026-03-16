/**
 * Step 51: Preset: Worms (f=0.078, k=0.061)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Worms (f=0.078, k=0.061)',
  chapter: 5,

  math: `<div class="math-section"><h3>Worms Pattern</h3>
<p>f=0.078, k=0.061: Long, worm-like domains that fill space. Intermediate between stripes and bubbles.
These patterns are highly dynamic and reorganize over time.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">const worms = { f: 0.078, k: 0.061, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.078: high feed — worms are well-fed and mobile
// k=0.061: moderate kill
// Result: elongated mobile structures, fills space efficiently
// More mobile than stripes — worms drift slowly
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['worms'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
