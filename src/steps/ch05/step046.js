/**
 * Step 46: lil-gui Setup — Parameter Panel
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'lil-gui Setup — Parameter Panel',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Immediate Mode GUI Philosophy</h3>
  <p>lil-gui follows the immediate mode paradigm — controls bind directly to JavaScript objects,
  with no separate state management. Changes propagate automatically from slider → object property →
  GPU uniform, eliminating synchronization bugs.</p>
</div>

<div class="math-section">
  <h3>dat.gui → lil-gui Migration</h3>
  <p>The Gray-Scott course originally used dat.gui, but migrated to lil-gui for better performance
  and modern features. The API is nearly identical:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Property references, not values: <code>gui.add(params, 'f')</code></li>
    <li>Range constraints: <code>add(params, 'f', 0.01, 0.12, 0.001)</code></li>
    <li>Change callbacks: <code>.onChange(value => { /* update */ })</code></li>
  </ul>
</div>

<div class="math-section">
  <h3>Why GUI Frameworks Use Property References</h3>
  <p>Instead of <code>gui.add('Feed Rate', 0.035)</code>, we use <code>gui.add(params, 'f')</code>.
  This creates a live binding — when the user drags the slider, the framework writes directly to
  <code>params.f</code>. No manual event handling needed.</p>
</div>

<div class="math-section">
  <h3>onChange Chain: Slider → simParams → GPU Uniform</h3>
  <p>The propagation path is:</p>
  <ol style="margin-left:16px; line-height:1.9">
    <li>User drags slider → lil-gui writes to <code>simParams.f</code></li>
    <li>onChange callback fires (optional validation/clamping)</li>
    <li>Animation loop calls <code>sim.step(simParams, stepsPerFrame)</code></li>
    <li><code>SimShader.update()</code> copies <code>simParams</code> to GLSL uniforms</li>
    <li>GPU reads new values on next render pass</li>
  </ol>
</div>

<div class="math-section">
  <h3>GUI Layout: Folders, Controllers, Ranges</h3>
  <p>The parameter panel organizes controls into collapsible folders:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Simulation:</strong> f, k, Du, Dv, dt with scientific ranges</li>
    <li><strong>Visualization:</strong> mode selector (bw, grayscale, invert, etc.)</li>
    <li><strong>Control:</strong> stepsPerFrame, reset, pause/play</li>
  </ul>
</div>
`,

  code: `
<div class="code-section">
  <h3>GuiManager.create() Call</h3>
<pre><code class="language-js">// From gpuLoop.js — GUI creation and setup
if (showGui) {
  gui = GuiManager.create(wrap)
  gui.domElement.style.display = 'none' // hidden by default

  // Simulation parameters folder
  const simFolder = gui.addFolder('Simulation')
  simFolder.add(simParams, 'f', 0.01, 0.12, 0.001)
    .name('f (feed)').onChange(v => { simParams.f = v })
  simFolder.add(simParams, 'k', 0.04, 0.07, 0.001)
    .name('k (kill)').onChange(v => { simParams.k = v })
  simFolder.add(simParams, 'Du', 0.05, 0.5, 0.001)
    .name('Du').onChange(v => { simParams.Du = v })
  simFolder.add(simParams, 'Dv', 0.01, 0.3, 0.001)
    .name('Dv').onChange(v => { simParams.Dv = v })
  simFolder.add(simParams, 'dt', 0.1, 2.0, 0.05).name('dt')

  simFolder.open() // expanded by default
}
</code></pre>
</div>

<div class="code-section">
  <h3>Folders and Controllers</h3>
<pre><code class="language-js">// Visualization controls
const vizFolder = gui.addFolder('Visualization')
const vizCtrl = { mode: currentVizMode }
vizFolder.add(vizCtrl, 'mode', ['bw','grayscale','invert','dual','contour','edge'])
  .name('mode').onChange(v => { currentVizMode = v })

// Control folder
const ctrlFolder = gui.addFolder('Control')
ctrlFolder.add({ stepsPerFrame: currentStepsPerFrame }, 'stepsPerFrame', 1, 32, 1)
  .name('steps/frame').onChange(v => { currentStepsPerFrame = v })

// All folders open by default for immediate access
simFolder.open()
vizFolder.open()
ctrlFolder.open()
</code></pre>
</div>

<div class="code-section">
  <h3>onChange Chain to GPU Uniforms</h3>
<pre><code class="language-js">// The complete flow from slider to GPU:

// 1. User drags f slider
// 2. lil-gui writes to simParams.f
simFolder.add(simParams, 'f', 0.01, 0.12, 0.001).onChange(v => {
  simParams.f = v  // optional validation here
})

// 3. Animation loop passes simParams to GPU
function animate() {
  sim.step(simParams, currentStepsPerFrame)  // ← simParams.f used here
  sim.render(currentVizMode)
}

// 4. Inside SimShader.update():
material.uniforms.uF.value = params.f  // ← GPU uniform updated
material.uniforms.uK.value = params.k
material.uniforms.uDu.value = params.Du
material.uniforms.uDv.value = params.Dv
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
