/**
 * Step 56: The (f,k) Parameter Map
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'The (f,k) Parameter Map',
  chapter: 5,

  math: `<div class="math-section"><h3>Phase Space Map</h3>
<p>The (f,k) plane is the master control surface. Different regions produce
qualitatively distinct attractors. The boundaries between regions are fractal-like.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Named regions of the (f,k) parameter space:
// Each region is an attractor basin — not a precise boundary but a rough map
const regions = [
  { f: 0.035, k: 0.065, name: 'spots' },
  { f: 0.060, k: 0.062, name: 'stripes' },
  { f: 0.078, k: 0.061, name: 'worms' },
  { f: 0.028, k: 0.053, name: 'mitosis' },
  { f: 0.098, k: 0.057, name: 'bubbles' },
  { f: 0.030, k: 0.057, name: 'solitons' },
  { f: 0.026, k: 0.051, name: 'chaos' },
  // f < 0.01 or k > 0.07: extinction (V dies out)
  // f > 0.10 + k < 0.05: homogeneous (U floods domain)
]
// Navigate with f,k sliders — watch patterns transform continuously
// Boundaries are fractal-like: approach from different directions → different transients
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
