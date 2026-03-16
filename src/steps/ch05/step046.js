/**
 * Step 46: lil-gui Setup: Parameter Panel
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'lil-gui Setup: Parameter Panel',
  chapter: 5,

  math: `<div class="math-section"><h3>lil-gui</h3>
<p>lil-gui creates interactive HTML controls bound to JavaScript objects.
Changes propagate to shader uniforms on the next frame — no recompilation needed.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// lil-gui: direct mutation binding
// gui.add(object, property, min, max, step) creates a slider
// Slider mutates object.property directly — no callbacks needed for params

const gui = new GUI()
const simFolder = gui.addFolder('Simulation')
simFolder.add(params, 'f', 0.01, 0.12, 0.001).name('f (feed)')
simFolder.add(params, 'k', 0.04, 0.07, 0.001).name('k (kill)')
simFolder.open()

// Each drag calls params.f = newValue automatically
// sim.step(params, n) reads params.f every frame → live response
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
