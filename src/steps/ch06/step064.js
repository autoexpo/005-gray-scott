/**
 * Step 64: Temporal Blending: Motion Blur
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Temporal Blending: Motion Blur',
  chapter: 6,

  math: `<div class="math-section"><h3>Motion Blur</h3>
<p>Blend the current frame with an accumulation buffer: out = 0.95 × prev + 0.05 × current.
Moving fronts leave a trail; stationary patterns remain sharp.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Temporal blending: mix current frame with previous
// Implemented with an extra FBO that accumulates history:
// blendFBO = mix(currentVizOutput, blendFBO, 0.9)
// → static patterns unchanged (0.9×stable = stable)
// → moving patterns leave trails (new positions blend over old)
// Trail length proportional to blend factor (0.9 = long, 0.5 = short)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['coral'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
