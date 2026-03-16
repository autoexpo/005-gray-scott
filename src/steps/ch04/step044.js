/**
 * Step 44: The Simulation Loop — rAF and Sub-Stepping
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'The Simulation Loop — rAF and Sub-Stepping',
  chapter: 4,

  math: `<div class="math-section">
<h3>requestAnimationFrame and Sub-Stepping</h3>
<p><strong>Frame Budget:</strong> requestAnimationFrame fires at 60Hz, giving us approximately 16.7ms per frame to maintain smooth animation.</p>

<p>If one simulation step takes 0.5ms on the GPU, we can fit multiple steps per frame:</p>
<div class="katex-display">$$\\text{Steps per frame} = \\frac{16.7\\text{ms budget}}{0.5\\text{ms per step}} = 33\\text{ steps max}$$</div>

<p><strong>Sub-Stepping Benefits:</strong> Running N steps per requestAnimationFrame call trades temporal resolution for faster pattern evolution. The visual appearance shows faster convergence to final patterns.</p>

<p><strong>Stability Unaffected:</strong> Each individual step still uses the same Δt, so numerical stability is unchanged. We're simply taking more steps before displaying the result.</p>

<p><strong>Sub-Stepping Relationship:</strong></p>
<div class="katex-display">$$t_{\\text{simulation}} = N_{\\text{frames}} \\times N_{\\text{steps/frame}} \\times \\Delta t$$</div>
<div class="katex-display">$$\\text{Real time} = \\frac{N_{\\text{frames}}}{60\\text{ fps}}$$</div>

<p>So the simulation runs at an effective speed of $60 \\times N_{\\text{steps/frame}} \\times \\Delta t$ simulation time units per real second.</p>
</div>`,

  code: `<div class="code-section">
<h3>Animation Loop from gpuLoop.js</h3>
<p>The core animation function that handles sub-stepping and performance monitoring:</p>
<pre><code class="language-js">// Animation loop
let frameId = null
let frame = 0
const animate = () => {
  frameId = requestAnimationFrame(animate)
  stats.begin()

  if (!paused) {
    sim.step(simParams, currentStepsPerFrame)
  }
  sim.render(currentVizMode)
  if (onFrame) onFrame(sim, frame)
  frame++

  stats.end()
}
animate()</code></pre>

<h3>Steps Per Frame Control</h3>
<p>The sub-stepping is controlled by the <code>currentStepsPerFrame</code> variable:</p>
<pre><code class="language-js">// GUI control for steps per frame
const ctrlFolder = gui.addFolder('Control')
ctrlFolder.add({ stepsPerFrame: currentStepsPerFrame }, 'stepsPerFrame', 1, 32, 1)
  .name('steps/frame')
  .onChange(v => { currentStepsPerFrame = v })

// Used in the animation loop
if (!paused) {
  sim.step(simParams, currentStepsPerFrame)  // N steps per frame
}</code></pre>

<h3>Pause/Resume Handling</h3>
<p>The animation loop continues running even when paused, but skips simulation steps:</p>
<pre><code class="language-js">// Controls for pause/resume
let paused = false
const controls = createSimControls(container, {
  onPause: (p) => { paused = p },      // Toggle pause state
  onReplay: () => { sim.reset(simParams) },  // Reset to initial conditions
})

// In the animate loop:
if (!paused) {
  sim.step(simParams, currentStepsPerFrame)  // Only step if not paused
}
sim.render(currentVizMode)  // Always render (shows frozen frame when paused)</code></pre>

<h3>Performance Monitoring with Stats.js</h3>
<pre><code class="language-js">// stats.begin()/end() wrap each frame
stats.begin()    // Start frame timing
// ... simulation and rendering ...
stats.end()      // End frame timing and update display</code></pre>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.worms,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 16,
      showGui: true
    })
  }
}