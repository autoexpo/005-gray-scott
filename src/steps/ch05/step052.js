/**
 * Step 52: Preset — Mitosis (f=0.028, k=0.053)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Mitosis (f=0.028, k=0.053)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Self-Replicating Spots — Each Spot Divides into Two</h3>
  <p>At f=0.028, k=0.053, individual spots exhibit remarkable self-replication behavior.
  A single spot grows in size, becomes elongated, develops a constriction in the middle,
  and finally splits into two daughter spots. This process repeats, leading to
  exponential spot multiplication.</p>
</div>

<div class="math-section">
  <h3>The Mechanism: Growth → Elongation → Splitting</h3>
  <p>The mitotic process involves several stages:</p>
  <ol style="margin-left:16px; line-height:1.9">
    <li><strong>Growth:</strong> Spot consumes local U and grows in diameter</li>
    <li><strong>Critical size:</strong> When spot exceeds critical radius, it becomes unstable</li>
    <li><strong>Elongation:</strong> Spot stretches into elliptical shape</li>
    <li><strong>Constriction:</strong> Middle narrows due to V diffusion</li>
    <li><strong>Division:</strong> Complete separation into two daughter spots</li>
  </ol>
</div>

<div class="math-section">
  <h3>Analogy to Cell Division</h3>
  <p>This behavior closely mimics biological mitosis:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Growth phase (G1/S/G2 in cell cycle)</li>
    <li>Metaphase alignment (elongation)</li>
    <li>Anaphase separation (constriction)</li>
    <li>Cytokinesis (complete division)</li>
  </ul>
  <p>The mathematical principles are remarkably similar to those governing
  real cell division processes.</p>
</div>

<div class="math-section">
  <h3>Critical Size Threshold</h3>
  <p>There exists a critical spot radius R_c above which mitosis becomes inevitable.
  This threshold can be estimated from the stability analysis:</p>
  <div class="math-block">$$R_c \\approx \\sqrt{\\frac{D_u}{f}} \\approx \\sqrt{\\frac{0.21}{0.028}} \\approx 2.7 \\text{ units}$$</div>
  <p>Spots smaller than R_c remain stable; larger spots undergo division.</p>
</div>

<div class="math-section">
  <h3>Period Doubling Route to Chaos as k Decreases</h3>
  <p>As k is reduced from 0.053, the mitotic behavior becomes more complex:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>k=0.053: Regular mitosis (period-1)</li>
    <li>k=0.051: Each spot divides into 4 (period-2)</li>
    <li>k=0.049: Period-4 division cascade</li>
    <li>k=0.047: Chaotic, unpredictable division</li>
  </ul>
  <p>This follows the classic period-doubling route to chaos discovered by Feigenbaum.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Mitosis Preset</h3>
<pre><code class="language-js">// From parameters.js
mitosis: {
  label: 'Mitosis',
  f: 0.028,    // lower feed rate creates scarcity
  k: 0.053,    // moderate kill rate
  Du: 0.2097,  // standard diffusion
  Dv: 0.105,
  dt: 1.0,
  description: 'Self-replicating spots that divide like cells.',
}

// Key insight: low f creates resource competition,
// which drives the growth-and-divide behavior
</code></pre>
</div>

<div class="code-section">
  <h3>How to Detect Spot Count Over Time</h3>
<pre><code class="language-js">// Count local maxima in V channel to track spot population
function countSpots(vData, width, height, threshold = 0.6) {
  const spots = []

  // Find local maxima (spots are V peaks)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      const centerVal = vData[idx]

      if (centerVal > threshold) {
        // Check if this is a local maximum
        let isMaximum = true
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const neighborIdx = (y + dy) * width + (x + dx)
            if (vData[neighborIdx] > centerVal) {
              isMaximum = false
              break
            }
          }
          if (!isMaximum) break
        }

        if (isMaximum) {
          spots.push({ x, y, intensity: centerVal })
        }
      }
    }
  }

  // Merge nearby spots (within 3 pixels)
  const mergedSpots = []
  for (const spot of spots) {
    let merged = false
    for (const existing of mergedSpots) {
      const dist = Math.sqrt((spot.x - existing.x) ** 2 + (spot.y - existing.y) ** 2)
      if (dist < 3) {
        // Keep the stronger spot
        if (spot.intensity > existing.intensity) {
          existing.x = spot.x
          existing.y = spot.y
          existing.intensity = spot.intensity
        }
        merged = true
        break
      }
    }
    if (!merged) {
      mergedSpots.push(spot)
    }
  }

  return mergedSpots.length
}

// Track population over time:
let frameCount = 0
const spotHistory = []

function trackMitosis(sim) {
  if (frameCount % 10 === 0) { // sample every 10 frames
    const vData = sim.getV()
    const spotCount = countSpots(vData, 256, 256)
    spotHistory.push({ frame: frameCount, spots: spotCount })

    if (spotHistory.length > 100) spotHistory.shift() // keep last 100
    console.log(\`Frame \${frameCount}: \${spotCount} spots\`)
  }
  frameCount++
}
</code></pre>
</div>

<div class="code-section">
  <h3>JavaScript Maxima Detection Algorithm</h3>
<pre><code class="language-js">// Robust spot detection using peak finding
class SpotDetector {
  constructor(threshold = 0.6, minDistance = 5) {
    this.threshold = threshold
    this.minDistance = minDistance
  }

  findSpots(vData, width, height) {
    // 1. Find all pixels above threshold
    const candidates = []
    for (let i = 0; i < vData.length; i++) {
      if (vData[i] > this.threshold) {
        const y = Math.floor(i / width)
        const x = i % width
        candidates.push({ x, y, value: vData[i] })
      }
    }

    // 2. Sort by intensity (strongest first)
    candidates.sort((a, b) => b.value - a.value)

    // 3. Non-maximum suppression
    const spots = []
    for (const candidate of candidates) {
      let tooClose = false
      for (const existingSpot of spots) {
        const dist = Math.sqrt(
          (candidate.x - existingSpot.x) ** 2 +
          (candidate.y - existingSpot.y) ** 2
        )
        if (dist < this.minDistance) {
          tooClose = true
          break
        }
      }
      if (!tooClose) {
        spots.push(candidate)
      }
    }

    return spots
  }
}

// Usage:
const detector = new SpotDetector(0.6, 5)
const spots = detector.findSpots(vData, 256, 256)
console.log(\`Detected \${spots.length} spots\`)
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.mitosis },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
