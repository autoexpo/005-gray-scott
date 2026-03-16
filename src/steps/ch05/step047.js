/**
 * Step 47: Live f and k Sliders
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Live f and k Sliders',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Sensitivity Analysis</h3>
  <p>How much does changing f by Δf = 0.001 change the pattern? The answer depends on where
  you are in the (f,k) parameter space. Near bifurcation boundaries, tiny changes cause
  dramatic pattern transitions. In stable regions, the pattern adapts gradually.</p>
</div>

<div class="math-section">
  <h3>Linearized Stability Around Operating Point</h3>
  <p>For a current operating point (f₀, k₀), the linearized stability analysis determines
  how perturbations δf, δk affect the dominant Fourier mode. The characteristic equation becomes:</p>
  <div class="math-block">$$\\lambda = f_0 - (f_0 + k_0) + \\delta f (1 - V_0) - \\delta k V_0$$</div>
  <p>where V₀ is the steady-state inhibitor concentration at the current operating point.</p>
</div>

<div class="math-section">
  <h3>Patterns Near Bifurcation Boundaries</h3>
  <p>Regions where small parameter changes cause qualitative pattern changes:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Spots → Stripes boundary around (f=0.04, k=0.06)</li>
    <li>Stripes → Worms transition as f increases</li>
    <li>Mitosis → Chaos boundary as k decreases</li>
    <li>Pattern death boundaries (too high f or k)</li>
  </ul>
</div>

<div class="math-section">
  <h3>Why the (f,k) Parameter Space is Rich</h3>
  <p>The Gray-Scott system exhibits multiple competing instabilities. Each (f,k) point
  selects which instability dominates. The rich phase diagram arises because different
  spatial scales become unstable in different parameter regions.</p>
</div>

<div class="math-section">
  <h3>Fold Bifurcation at Pattern Boundary</h3>
  <p>At the boundary between patterned and uniform states, the system undergoes a
  fold bifurcation. The bifurcation occurs when the linear stability eigenvalue
  passes through zero:</p>
  <div class="math-block">$$\\lambda(f, k, q) = 0$$</div>
  <p>where q is the spatial wavenumber.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Specific lil-gui Controller Code for f and k</h3>
<pre><code class="language-js">// From gpuLoop.js — the f and k sliders
const simFolder = gui.addFolder('Simulation')

// f slider: fine-grained control for sensitivity analysis
simFolder.add(simParams, 'f', 0.01, 0.12, 0.001)
  .name('f (feed)')
  .onChange(v => {
    simParams.f = v
    console.log(\`f changed to \${v.toFixed(3)}\`)
  })

// k slider: kill rate with similar precision
simFolder.add(simParams, 'k', 0.04, 0.07, 0.001)
  .name('k (kill)')
  .onChange(v => {
    simParams.k = v
    console.log(\`k changed to \${v.toFixed(3)}\`)
  })

// Step size 0.001 allows fine exploration of bifurcation boundaries
</code></pre>
</div>

<div class="code-section">
  <h3>Range Constraints and Step Sizes</h3>
<pre><code class="language-js">// Scientifically meaningful parameter ranges
const ranges = {
  f: { min: 0.01, max: 0.12, step: 0.001 },  // feed rate
  k: { min: 0.04, max: 0.07, step: 0.001 },  // kill rate
  Du: { min: 0.05, max: 0.50, step: 0.001 }, // U diffusion
  Dv: { min: 0.01, max: 0.30, step: 0.001 }, // V diffusion
  dt: { min: 0.1, max: 2.0, step: 0.05 },    // time step
}

// Step size 0.001 for f and k allows exploring sensitivity
// near bifurcation boundaries without overshooting
</code></pre>
</div>

<div class="code-section">
  <h3>Preset-Switcher Dropdown Implementation</h3>
<pre><code class="language-js">// Add preset selector to GUI
const presetCtrl = { preset: 'spots' }
simFolder.add(presetCtrl, 'preset', Object.keys(PRESETS))
  .name('preset')
  .onChange(presetName => {
    const preset = PRESETS[presetName]
    // Copy all preset values to simParams
    Object.assign(simParams, preset)

    // Update all GUI controllers to show new values
    gui.controllersRecursive().forEach(controller => {
      controller.updateDisplay()
    })

    // Reset simulation to show new pattern from clean state
    sim.reset(simParams)
  })
</code></pre>
</div>

<div class="code-section">
  <h3>Animated Parameter Sweep</h3>
<pre><code class="language-js">// Add "Sweep f" button that animates f from 0.02 to 0.06 over 5 seconds
let sweeping = false
const sweepCtrl = {
  sweepF() {
    if (sweeping) return
    sweeping = true

    const startF = 0.020
    const endF = 0.060
    const duration = 5000 // ms
    const startTime = Date.now()

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Linear interpolation
      const currentF = startF + (endF - startF) * progress
      simParams.f = currentF

      // Update GUI display
      gui.controllersRecursive().find(c => c.property === 'f')?.updateDisplay()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        sweeping = false
      }
    }
    animate()
  }
}

ctrlFolder.add(sweepCtrl, 'sweepF').name('Sweep f (0.02→0.06)')
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
      onGui(gui, sim, simParams) {
        // Add the "Sweep f" button
        let sweeping = false
        const ctrlFolder = gui.folders.find(f => f._title === 'Control')

        if (ctrlFolder) {
          const sweepCtrl = {
            sweepF() {
              if (sweeping) return
              sweeping = true

              const startF = 0.020
              const endF = 0.060
              const duration = 5000 // 5 seconds
              const startTime = Date.now()

              function animate() {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                const currentF = startF + (endF - startF) * progress
                simParams.f = currentF

                if (progress < 1) {
                  requestAnimationFrame(animate)
                } else {
                  sweeping = false
                }
              }
              animate()
            }
          }

          ctrlFolder.add(sweepCtrl, 'sweepF').name('Sweep f (0.02→0.06)')
        }
      }
    })
  }
}
