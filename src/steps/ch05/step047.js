/**
 * Step 47: Live f and k Sliders
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Live f and k Sliders',
  chapter: 5,

  math: `<div class="math-section"><h3>Real-Time Uniform Hot-Swap</h3>
<p>Moving the f or k sliders changes the corresponding uniform immediately.
The simulation adapts: patterns will gradually transition to the new parameter regime.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Live parameter exploration — drag sliders to traverse (f,k) space
// Key transitions to find by dragging:
//   f=0.035 k=0.065  → spots
//   f=0.060 k=0.062  → stripes  (increase f from spots)
//   f=0.028 k=0.053  → mitosis  (decrease both from spots)
//   f=0.026 k=0.051  → chaos    (decrease further)

// Pattern changes are NOT instantaneous — the current state takes time
// to reorganise to the new attractor (transient dynamics)
// Hit Replay to see the new parameters from a fresh seed

simFolder.add(params, 'f', 0.01, 0.12, 0.001)
  .name('f (feed)')
  .onChange(() => { /* params.f already updated */ })
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
