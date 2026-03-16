/**
 * Step 43: First GPU Simulation: Correctness Check
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'First GPU Simulation: Correctness Check',
  chapter: 4,

  math: `<div class="math-section"><h3>GPU vs CPU Correctness</h3>
<p>Running both CPU and GPU with identical initial conditions for 200 steps,
the RMS difference in U should be below 1e-4 (floating-point precision).
Larger differences indicate a bug in the GLSL shader.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Validate GPU against CPU reference (same init, N steps)
const gpu = new GPUSim(renderer, 64)
const cpu = new Integrator(64, 64)
gpu.reset(params); cpu.reset(params)

for (let i = 0; i < 100; i++) {
  gpu.step(params, 1)
  cpu.step(params, 1)
}

// Read GPU texture back to CPU
const gpuData = gpu.readback()  // Float32Array RGBA

let maxErr = 0
for (let i = 0; i < 64*64; i++) {
  maxErr = Math.max(maxErr, Math.abs(gpuData[i*4] - cpu.u[i]))
}
console.log('Max error:', maxErr)  // expect < 1e-4
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
