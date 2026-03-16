/**
 * Step 75: Euler vs RK4 — Accuracy Comparison
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Euler vs RK4 — Accuracy Comparison',
  chapter: 7,

  math: `<div class="math-section"><h3>Quantitative Accuracy Analysis</h3>
<p>For Gray-Scott at typical parameters, quantitative comparison of integration methods:</p>
<div class="math-block">$$\\text{Euler local error:} \\quad E_{\\text{Euler}} \\approx \\frac{\\Delta t^2}{2} |f''| \\approx 0.05 \\quad \\text{(at dt=1.0)}$$</div>
<div class="math-block">$$\\text{RK4 local error:} \\quad E_{\\text{RK4}} \\approx \\frac{\\Delta t^5}{720} |f''''| \\approx 10^{-5} \\quad \\text{(at dt=1.0)}$$</div>
<p><strong>Same accuracy, different cost</strong>:</p>
<ul>
<li>Euler at dt=0.5 gives same accuracy as RK4 at dt=1.0</li>
<li>But Euler needs 2× more steps = 2× compute cost</li>
<li>RK4 needs 4× more work per step but can use 2× larger dt</li>
<li>Net result: RK4 is 4/2 = 2× more expensive for same accuracy</li>
</ul>
<p><strong>For Gray-Scott</strong>: Euler at dt=1.0 is sufficiently accurate and much simpler</p>
<p><strong>RK4 benefit</strong>: Better stability properties and smoother temporal dynamics</p></div>`,

  code: `<div class="code-section"><h3>CPU Accuracy Comparison</h3>
<pre><code class="language-js">// Compare Euler vs RK4 accuracy on CPU
function compareIntegrators(params, nSteps = 1000) {
  const size = 64  // Small for CPU
  const dt = 1.0

  // Initialize identical fields
  const u1 = new Float32Array(size * size).fill(0.5)
  const v1 = new Float32Array(size * size).fill(0.25)
  const u2 = new Float32Array(size * size).fill(0.5)
  const v2 = new Float32Array(size * size).fill(0.25)

  // Add same initial perturbation
  const center = Math.floor(size / 2)
  const idx = center * size + center
  u1[idx] = u2[idx] = 0.3
  v1[idx] = v2[idx] = 0.6

  console.time('Euler')
  for (let step = 0; step < nSteps; step++) {
    eulerStep(u1, v1, params, dt)
  }
  console.timeEnd('Euler')

  console.time('RK4')
  for (let step = 0; step < nSteps; step++) {
    rk4Step(u2, v2, params, dt)
  }
  console.timeEnd('RK4')

  // Compare final results (RMS difference)
  let sumSquareDiff = 0
  for (let i = 0; i < u1.length; i++) {
    const du = u1[i] - u2[i]
    const dv = v1[i] - v2[i]
    sumSquareDiff += du * du + dv * dv
  }
  const rmsDiff = Math.sqrt(sumSquareDiff / (2 * u1.length))

  console.log(\`RMS difference: \${rmsDiff.toExponential(3)}\`)
  console.log(\`Euler final range: [\${Math.min(...u1).toFixed(3)}, \${Math.max(...u1).toFixed(3)}]\`)
  console.log(\`RK4 final range: [\${Math.min(...u2).toFixed(3)}, \${Math.max(...u2).toFixed(3)}]\`)

  return { rmsDiff, eulerFinal: u1, rk4Final: u2 }
}

// Simple Euler step (CPU)
function eulerStep(u, v, params, dt) {
  const { f, k, Du, Dv } = params
  const size = Math.sqrt(u.length)

  // Simplified reaction + diffusion
  for (let i = 0; i < u.length; i++) {
    const ui = u[i], vi = v[i]
    const reaction_u = -ui * vi * vi + f * (1 - ui)
    const reaction_v = ui * vi * vi - (f + k) * vi

    u[i] += dt * reaction_u
    v[i] += dt * reaction_v
  }
}</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.stripes,
      size: 256,
      vizMode: 'bw',
      stepsPerFrame: 8,
      showGui: true
    })
  }
}
