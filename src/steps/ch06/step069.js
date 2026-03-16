/**
 * Step 69: Stats.js — FPS and Timing
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Stats.js — FPS and Timing',
  chapter: 6,

  math: `<div class="math-section">
<h3>Performance Measurement</h3>
<p>Frames per second is the reciprocal of frame time:</p>
<p>$$\\text{FPS} = \\frac{1}{\\text{frame time}}$$</p>

<h4>60 FPS Target Budget</h4>
<p>At 60 FPS, each frame has a budget of:</p>
<p>$$\\text{frame budget} = \\frac{1000 \\text{ ms}}{60 \\text{ fps}} = 16.67 \\text{ ms}$$</p>

<h4>Gray-Scott Performance Breakdown</h4>
<p>Typical performance costs at 256×256 resolution:</p>
<p>• **Simulation step**: ~0.5 ms per Gray-Scott integration step</p>
<p>• **Rendering**: ~0.2 ms for visualization shader</p>
<p>• **WebGL overhead**: ~0.2 ms per draw call</p>
<p>• **Total per frame**: (0.5 × stepsPerFrame) + 0.4 ms</p>

<h4>Moving Average Smoothing</h4>
<p>Stats.js uses a 60-frame moving average for stable FPS readout:</p>
<p>$$\\text{FPS}_{\\text{smooth}} = \\frac{60}{\\sum_{i=0}^{59} t_i}$$</p>
<p>This prevents jittery numbers from frame-to-frame variation.</p>

<h4>Substep Budget Analysis</h4>
<p>Maximum substeps per frame at 60 FPS:</p>
<p>$$\\text{max steps} = \\lfloor \\frac{16.67 - 0.4}{0.5} \\rfloor \\approx 32$$</p>
</div>`,

  code: `<div class="code-section">
<h3>Stats.js Integration in gpuLoop.js</h3>
<pre><code class="language-js">// From gpuLoop.js - Stats initialization:
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0)  // 0: FPS, 1: MS, 2: MB
stats.dom.style.cssText = 'position:absolute;top:4px;left:4px;display:none;'
wrap.appendChild(stats.dom)

// Animation loop with timing:
const animate = () => {
  frameId = requestAnimationFrame(animate)
  stats.begin()  // Start timing

  if (!paused) {
    sim.step(simParams, currentStepsPerFrame)  // Simulation
  }
  sim.render(currentVizMode)  // Rendering
  if (onFrame) onFrame(sim, frame)
  frame++

  stats.end()  // End timing
}</code></pre>

<h4>Stats Panel Switching</h4>
<pre><code class="language-js">// Click to cycle through panels:
stats.showPanel(0);  // FPS (green)
stats.showPanel(1);  // MS (yellow)
stats.showPanel(2);  // MB (red, memory)

// Manual timing with performance.now():
const startTime = performance.now();
// ... expensive operation ...
const endTime = performance.now();
console.log(\`Operation took \${endTime - startTime} milliseconds\`);</code></pre>

<h4>Toggle Stats Visibility</h4>
<pre><code class="language-js">// From gpuLoop.js - Stats toggle button:
const extraButtons = [
  {
    label: 'Stats',
    onToggle: (active) => {
      stats.dom.style.display = active ? 'block' : 'none'
    },
  },
]</code></pre>

<h4>Performance Optimization Tips</h4>
<pre><code class="language-js">// Monitor performance impact of different settings:
// - Higher stepsPerFrame: more simulation cost
// - Larger grid size: quadratic cost increase
// - Complex visualization: fragment shader cost
// - Mouse seeding: extra texture uploads</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true
    })
  }
}