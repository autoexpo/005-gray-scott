/**
 * Step 54: Preset: Coral (f=0.059, k=0.062)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset: Coral (f=0.059, k=0.062)',
  chapter: 5,

  math: `<div class="math-section"><h3>Coral Pattern</h3>
<p>f=0.059, k=0.062: Dendritic, branching structures resembling coral.
Similar to diffusion-limited aggregation (DLA) patterns.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">const coral = { f: 0.059, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }
// f=0.059: just below stripes (f=0.060) — tiny difference, different topology
// k=0.062: same kill as stripes
// Result: dendritic branching instead of labyrinths
// Illustrates fractal-like sensitivity near region boundaries
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['coral'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
    })
  }
}
