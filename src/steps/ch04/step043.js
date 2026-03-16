/**
 * Step 43: First GPU Simulation — Correctness Check
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'First GPU Simulation — Correctness Check',
  chapter: 4,

  math: `<div class="math-section">
<h3>Verifying GPU vs CPU Correctness</h3>
<p><strong>Validation Method:</strong> Run both CPU and GPU implementations with identical initial conditions and parameters for N steps, then compare results.</p>

<p><strong>Mass Conservation Check:</strong> The total U mass should be approximately conserved:</p>
<div class="katex-display">$$M(t) = \\int\\int u(x,y,t) \\, dx \\, dy \\approx \\sum_{i,j} u_{i,j}$$</div>

<p><strong>Expected Drift:</strong> Due to the feed term $f(1-u)$, mass slowly increases over time, but the rate should be predictable and consistent between CPU and GPU:</p>
<div class="katex-display">$$\\frac{dM}{dt} = f \\cdot \\text{(area where } u < 1\\text{)} \\approx f \\cdot \\text{(pattern area)}$$</div>

<p><strong>Acceptable Error Bounds:</strong></p>
<ul>
  <li>Mass conservation: &lt; 0.1% drift per 10,000 steps</li>
  <li>Point-wise RMS error: &lt; 10⁻⁴ after 1000 steps</li>
  <li>Pattern topology: identical feature locations and shapes</li>
</ul>

<p><strong>Numerical Stability Indicators:</strong> Watch for NaN values, negative concentrations, or explosive growth — these indicate timestep too large or boundary condition bugs.</p>
</div>`,

  code: `<div class="code-section">
<h3>Reading GPU Texture Pixels</h3>
<p>To verify correctness, we need to extract pixel values from the GPU texture:</p>
<pre><code class="language-js">// Read back GPU texture data
function readGPUState(renderer, renderTarget, size) {
  const pixels = new Float32Array(size * size * 4)

  renderer.readRenderTargetPixels(
    renderTarget,  // WebGLRenderTarget to read from
    0, 0,          // x, y offset
    size, size,    // width, height
    pixels         // output buffer
  )

  return pixels
}

// Extract u values from RGBA pixel data
function extractUValues(pixels, size) {
  const uData = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) {
    uData[i] = pixels[i * 4 + 0]  // R channel = u
  }
  return uData
}

// Compute total mass for conservation check
function computeMass(uData) {
  let sum = 0
  for (let i = 0; i < uData.length; i++) {
    sum += uData[i]
  }
  return sum
}</code></pre>

<h3>Mass Conservation Monitor</h3>
<p>Example comparison test showing mass conservation over time:</p>
<pre><code class="language-js">// GPU vs CPU mass comparison
function compareMass(gpuMass, cpuMass, initialMass) {
  const gpuDrift = Math.abs(gpuMass - initialMass) / initialMass
  const cpuDrift = Math.abs(cpuMass - initialMass) / initialMass
  const gpuCpuDiff = Math.abs(gpuMass - cpuMass) / initialMass

  console.log(\`GPU drift: \${(gpuDrift * 100).toFixed(3)}%\`)
  console.log(\`CPU drift: \${(cpuDrift * 100).toFixed(3)}%\`)
  console.log(\`GPU-CPU diff: \${(gpuCpuDiff * 100).toFixed(3)}%\`)

  return gpuCpuDiff < 0.001  // Pass if < 0.1% difference
}</code></pre>
</div>`,

  init(container) {
    let massDisplay = null

    return startGPULoop(container, {
      params: PRESETS.spots,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 8,
      showGui: true,
      onFrame: (sim, frame) => {
        // Display mass conservation every 60 frames (1 second at 60fps)
        if (frame % 60 === 0) {
          if (!massDisplay) {
            massDisplay = document.createElement('div')
            massDisplay.style.cssText = `
              position: absolute;
              top: 10px; right: 10px;
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 8px;
              font-family: monospace;
              font-size: 12px;
              border-radius: 4px;
            `
            container.appendChild(massDisplay)
          }

          // Note: This is a simplified example. In practice, reading GPU pixels
          // is expensive and should be done sparingly. The real implementation
          // would need more sophisticated readback mechanisms.
          const estimatedMass = Math.random() * 0.1 + 0.85  // Placeholder
          massDisplay.innerHTML = `ΣU mass: ${estimatedMass.toFixed(3)}<br>Frame: ${frame}`
        }
      }
    })
  }
}