/**
 * Step 52: Preset: Mitosis (f=0.028, k=0.053)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Mitosis (f=0.028, k=0.053)',
  chapter: 5,

  math: `<div class="math-section"><h3>Mitosis Pattern</h3>
<p>f=0.028, k=0.053: Self-replicating spots that divide like biological cells.
A spot grows elongated, then pinches off into two daughter spots.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">const mitosis = { f: 0.028, k: 0.053, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.028: very low feed — V must be self-sustaining
// k=0.053: low kill — V can elongate before being destroyed
// Cycle: spot → grows → elongates → pinches → two spots
// Self-replication time: ~2000-5000 time units per division
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['mitosis'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
