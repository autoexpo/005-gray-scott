/**
 * Step 44: The Simulation Loop: rAF and Sub-Stepping
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'The Simulation Loop: rAF and Sub-Stepping',
  chapter: 4,

  math: `<div class="math-section"><h3>Sub-Stepping</h3>
<p>We run multiple simulation steps per requestAnimationFrame call.
The GPU can do 8–32 steps per frame at 60fps for a 256×256 grid.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Sub-stepped RAF loop: run N sim steps per display frame
// Pattern formation needs ~5000 time units
// At 60fps × 8 steps/frame × dt=1.0 → ~480 units/sec → ~10s to patterns

let stepsPerFrame = 8
function animate() {
  requestAnimationFrame(animate)
  if (!paused) {
    sim.step(params, stepsPerFrame)  // N parallel GPU steps
  }
  sim.render(vizMode)
}

// Trade-off: higher stepsPerFrame → faster patterns, lower frame rate
// 8 steps/frame @ 256×256 ≈ 60fps on modern GPU
// 32 steps/frame @ 512×512 may drop to 30fps
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
