/**
 * Step 69: Stats.js: FPS and Timing
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Stats.js: FPS and Timing',
  chapter: 6,

  math: `<div class="math-section"><h3>Stats.js Performance Monitor</h3>
<p>Stats.js shows real-time FPS (panel 0), milliseconds per frame (panel 1),
and memory usage (panel 2). Essential for performance profiling.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Stats.js performance monitoring
import Stats from 'stats.js'
const stats = new Stats()
stats.showPanel(0)  // 0=fps, 1=ms/frame, 2=memory
document.body.appendChild(stats.dom)

function animate() {
  stats.begin()

  sim.step(params, stepsPerFrame)   // GPU compute
  sim.render(vizMode)               // GPU display

  stats.end()
  requestAnimationFrame(animate)
}

// Target: 60fps (16ms/frame) at 256×256, stepsPerFrame=8
// If below 60fps: reduce stepsPerFrame or grid size
// stepsPerFrame=32 at 512×512 may drop to 30fps on integrated GPU
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
