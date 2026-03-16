/**
 * Step 55: Preset — Solitons (Traveling Pulses)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Solitons (Traveling Pulses)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Solitons in Gray-Scott — Stable Traveling Wave Solutions</h3>
  <p>At f=0.030, k=0.057, the Gray-Scott system supports soliton solutions —
  localized wave packets that maintain their shape while propagating through
  the medium. These are remarkably stable structures that can travel long
  distances without dispersion.</p>
</div>

<div class="math-section">
  <h3>The KdV Soliton Analogy</h3>
  <p>Gray-Scott solitons share mathematical properties with Korteweg-de Vries (KdV)
  solitons:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Nonlinear wave solutions that resist dispersion</li>
    <li>Particle-like behavior (localized energy packets)</li>
    <li>Stable propagation over long distances</li>
    <li>Interaction properties (collision dynamics)</li>
  </ul>
</div>

<div class="math-section">
  <h3>Why GS Solitons Maintain Shape During Propagation</h3>
  <p>The soliton stability arises from a balance between:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Dispersion:</strong> Different wavelengths travel at different speeds</li>
    <li><strong>Nonlinearity:</strong> Wave amplitude affects propagation speed</li>
  </ul>
  <p>When these effects exactly cancel, the wave maintains constant shape and speed.</p>
</div>

<div class="math-section">
  <h3>Collision Behavior — Annihilation or Pass-Through</h3>
  <p>When two solitons collide, the outcome depends on their relative amplitudes
  and the system parameters:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Elastic collision:</strong> Both solitons survive with unchanged properties</li>
    <li><strong>Annihilation:</strong> Solitons destroy each other upon collision</li>
    <li><strong>Fusion:</strong> Two solitons merge into a single larger pulse</li>
  </ul>
</div>

<div class="math-section">
  <h3>Wave Speed as Function of (f,k)</h3>
  <p>The soliton propagation speed can be approximated by:</p>
  <div class="math-block">$$v \\approx \\sqrt{\\frac{D_u(f-k)}{1+k/f}}$$</div>
  <p>For the solitons preset: v ≈ √(0.21 × 0.027/1.9) ≈ 0.19 units/time</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Solitons Preset</h3>
<pre><code class="language-js">// From parameters.js
solitons: {
  label: 'Solitons',
  f: 0.030,    // low feed creates traveling waves
  k: 0.057,    // moderate kill rate
  Du: 0.2097,  // standard diffusion
  Dv: 0.105,
  dt: 1.0,
  description: 'Stable traveling wave pulses (solitons).',
}

// The low f/k ratio creates conditions for soliton propagation
</code></pre>
</div>

<div class="code-section">
  <h3>How to Track Wave Front Position Over Time</h3>
<pre><code class="language-js">// Track soliton position using threshold crossing detection
function trackSolitonPosition(uData, width, height, threshold = 0.3) {
  // Find the center of mass of the soliton (U > threshold)
  let totalMass = 0
  let centerX = 0
  let centerY = 0
  let maxU = 0
  let maxPos = { x: 0, y: 0 }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const u = uData[idx]

      if (u > threshold) {
        const mass = u - threshold
        totalMass += mass
        centerX += x * mass
        centerY += y * mass
      }

      if (u > maxU) {
        maxU = u
        maxPos = { x, y }
      }
    }
  }

  if (totalMass > 0) {
    centerX /= totalMass
    centerY /= totalMass
  }

  return {
    centerOfMass: { x: centerX, y: centerY },
    peak: maxPos,
    totalMass,
    maxAmplitude: maxU
  }
}

// Track soliton motion over time
let solitonHistory = []
let frameCount = 0

function trackSolitonMotion(sim) {
  if (frameCount % 5 === 0) { // sample every 5 frames
    const uData = sim.getU()
    const position = trackSolitonPosition(uData, 256, 256)
    
    solitonHistory.push({
      frame: frameCount,
      ...position
    })

    // Calculate velocity from last two positions
    if (solitonHistory.length >= 2) {
      const curr = solitonHistory[solitonHistory.length - 1]
      const prev = solitonHistory[solitonHistory.length - 2]
      
      const dx = curr.centerOfMass.x - prev.centerOfMass.x
      const dy = curr.centerOfMass.y - prev.centerOfMass.y
      const dt = curr.frame - prev.frame
      
      const velocity = Math.sqrt(dx*dx + dy*dy) / dt
      console.log(\`Soliton velocity: \${velocity.toFixed(3)} pixels/frame\`)
    }

    if (solitonHistory.length > 200) solitonHistory.shift() // keep recent history
  }
  frameCount++
}
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.solitons },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
