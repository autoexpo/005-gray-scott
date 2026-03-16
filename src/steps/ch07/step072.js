/**
 * Step 72: Numerical Instability Demo — dt Too Large
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Numerical Instability Demo — dt Too Large',
  chapter: 7,

  math: `<div class="math-section"><h3>What Happens When dt > dt_max</h3>
<p>When the time step exceeds the CFL stability limit, the numerical scheme becomes unstable:</p>
<div class="math-block">$$dt > \\frac{h^2}{4D_{\\max}} \\Rightarrow |G(q)| > 1$$</div>
<p>The amplification factor for high-frequency modes (q ≈ π, Nyquist frequency) becomes:</p>
<div class="math-block">$$|G(\\pi)| = |1 - 4D\\frac{\\Delta t}{h^2}| > 1$$</div>
<p>This causes exponential growth of numerical errors:</p>
<ul>
<li><strong>High-frequency oscillations</strong> appear first (checkerboard patterns)</li>
<li><strong>Rapid divergence</strong> occurs within ~10 time steps</li>
<li><strong>NaN propagation</strong>: Once one cell hits NaN, it spreads to all neighbors in one step through the Laplacian stencil</li>
<li><strong>Total failure</strong>: The entire simulation becomes meaningless</li>
</ul>
<p>The eigenvalue analysis shows that for the 5-point Laplacian, the largest eigenvalue is 4D/h², requiring dt < h²/(4D) for stability.</p></div>`,

  code: `<div class="code-section"><h3>Detecting and Preventing Instability</h3>
<pre><code class="language-js">// Check for NaN propagation in GPU data
function detectInstability(renderer, readBuffer) {
  const pixels = new Float32Array(256 * 256 * 4)
  renderer.readRenderTargetPixels(readBuffer, 0, 0, 256, 256, pixels)

  let nanCount = 0
  let maxValue = 0

  for (let i = 0; i < pixels.length; i += 4) {
    const u = pixels[i]
    const v = pixels[i + 1]

    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      nanCount++
    }

    maxValue = Math.max(maxValue, Math.abs(u), Math.abs(v))
  }

  return {
    hasNaN: nanCount > 0,
    nanCount,
    maxValue,
    isUnstable: maxValue > 10 || nanCount > 0
  }
}

// Safe dt calculation
function calculateSafeDt(Du, Dv, safetyFactor = 0.8) {
  const Dmax = Math.max(Du, Dv)
  const dtMax = 1 / (4 * Dmax) // h = 1
  return dtMax * safetyFactor
}

// Clamp dt to safe range
function clampDt(params) {
  const safeDt = calculateSafeDt(params.Du, params.Dv)
  if (params.dt > safeDt) {
    console.warn(\`dt=\${params.dt} too large, clamping to \${safeDt.toFixed(3)}\`)
    params.dt = safeDt
  }
  return params
}</code></pre></div>`,

  init(container, state) {
    // Use startGPULoop with unstable dt=1.5
    const params = {
      ...PRESETS.spots,
      dt: 1.5  // Above CFL limit for some high-frequency modes
    }

    let instabilityDetected = false
    let frameCount = 0

    const cleanup = startGPULoop(container, {
      params,
      size: 256,
      vizMode: 'bw',
      stepsPerFrame: 8,
      showGui: true,
      onGui: (gui, sim, simParams) => {
        // Add instability monitor
        const monitorFolder = gui.addFolder('Instability Monitor')

        const monitor = {
          dtValue: simParams.dt,
          maxValue: 0,
          status: 'Stable'
        }

        monitorFolder.add(monitor, 'dtValue').name('Current dt').listen()
        monitorFolder.add(monitor, 'maxValue').name('Max |U,V|').listen()
        monitorFolder.add(monitor, 'status').name('Status').listen()

        monitorFolder.open()

        // Update monitor values
        const updateMonitor = () => {
          monitor.dtValue = simParams.dt

          // Simple stability check based on dt
          const Du = simParams.Du || 0.2097
          const dtMax = 1 / (4 * Du)

          if (simParams.dt > dtMax * 1.1) {
            monitor.status = 'UNSTABLE'
          } else if (simParams.dt > dtMax * 0.9) {
            monitor.status = 'Marginal'
          } else {
            monitor.status = 'Stable'
          }
        }

        // Update every second
        setInterval(updateMonitor, 1000)
      },
      onFrame: (sim, frame) => {
        frameCount++

        // Check for instability every 30 frames
        if (frameCount % 30 === 0) {
          // For demo purposes, we'll simulate detection
          // In real implementation, you'd read back GPU data
          const currentDt = params.dt
          const Du = params.Du || 0.2097
          const dtMax = 1 / (4 * Du)

          if (currentDt > dtMax && frameCount > 100) {
            if (!instabilityDetected) {
              console.warn('Instability detected: artifacts appearing')
              instabilityDetected = true
            }
          }
        }
      }
    })

    return cleanup
  }
}
