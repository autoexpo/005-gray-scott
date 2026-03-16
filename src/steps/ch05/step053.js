/**
 * Step 53: Preset — Bubbles (f=0.098, k=0.057)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Bubbles (f=0.098, k=0.057)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Bubble Domains — Large Regions of High V</h3>
  <p>At f=0.098, k=0.057, the system produces bubble-like domains — large regions
  of high V concentration surrounded by thin boundaries of U. This represents the
  inverse of the spot pattern: instead of isolated spots of V, we have isolated
  regions of U surrounded by a sea of V.</p>
</div>

<div class="math-section">
  <h3>Inverse of Spot Pattern</h3>
  <p>Bubbles are topologically complementary to spots:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Spots:</strong> High V islands in U sea</li>
    <li><strong>Bubbles:</strong> High V sea with U islands</li>
  </ul>
  <p>The high feed rate f=0.098 creates such an abundant U supply that V can
  dominate most of the space, leaving only small refugia for U.</p>
</div>

<div class="math-section">
  <h3>Ostwald Ripening Process</h3>
  <p>Bubbles exhibit Ostwald ripening — large bubbles grow at the expense of smaller
  ones. This occurs because smaller bubbles have higher curvature, creating a
  chemical potential gradient that drives material transport from small to large
  bubbles.</p>
</div>

<div class="math-section">
  <h3>The Lifshitz-Slyozov Law for Bubble Coarsening</h3>
  <p>The average bubble radius grows with time according to:</p>
  <div class="math-block">$$\\langle R(t) \\rangle^3 = \\langle R_0 \\rangle^3 + Kt$$</div>
  <p>where K is the coarsening rate constant. This cubic growth law is characteristic
  of diffusion-limited coarsening processes.</p>
</div>

<div class="math-section">
  <h3>Why Bubbles Compete for Space</h3>
  <p>Each bubble acts as a sink for U diffusion. Neighboring bubbles compete for
  the limited U supply. This competition drives the coarsening dynamics — bubbles
  that are more efficient at capturing U will grow, while less efficient ones shrink
  and eventually disappear.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Bubbles Preset</h3>
<pre><code class="language-js">// From parameters.js
bubbles: {
  label: 'Bubbles',
  f: 0.098,    // very high feed rate
  k: 0.057,    // moderate kill rate
  Du: 0.2097,  // standard diffusion
  Dv: 0.105,
  dt: 1.0,
  description: 'Growing bubble domains competing for space.',
}

// The high f creates U abundance → V dominates → bubble morphology
</code></pre>
</div>

<div class="code-section">
  <h3>How to Measure Bubble Areas Using Flood-Fill</h3>
<pre><code class="language-js">// Detect and measure bubble domains
function measureBubbleAreas(vData, width, height, threshold = 0.5) {
  // Create binary image: 1 = bubble interior, 0 = boundary/exterior
  const binary = new Uint8Array(width * height)
  for (let i = 0; i < vData.length; i++) {
    binary[i] = vData[i] > threshold ? 1 : 0
  }

  // Connected component analysis using flood fill
  const visited = new Uint8Array(width * height)
  const bubbles = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (binary[idx] === 1 && !visited[idx]) {
        // Start new bubble
        const bubble = floodFillBubble(binary, visited, width, height, x, y)
        if (bubble.area > 50) { // ignore tiny bubbles
          bubbles.push(bubble)
        }
      }
    }
  }

  return bubbles.sort((a, b) => b.area - a.area) // largest first
}

function floodFillBubble(binary, visited, width, height, startX, startY) {
  const stack = [{ x: startX, y: startY }]
  let area = 0
  let minX = startX, maxX = startX, minY = startY, maxY = startY

  while (stack.length > 0) {
    const { x, y } = stack.pop()
    const idx = y * width + x

    if (x < 0 || x >= width || y < 0 || y >= height) continue
    if (visited[idx] || binary[idx] === 0) continue

    visited[idx] = 1
    area++

    // Update bounding box
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)

    // Add neighbors
    stack.push({ x: x+1, y }, { x: x-1, y }, { x, y: y+1 }, { x, y: y-1 })
  }

  return {
    area,
    boundingBox: { minX, maxX, minY, maxY },
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    aspectRatio: (maxX - minX + 1) / (maxY - minY + 1)
  }
}

// Usage:
const bubbles = measureBubbleAreas(sim.getV(), 256, 256)
console.log(\`Found \${bubbles.length} bubbles\`)
console.log(\`Largest bubble area: \${bubbles[0]?.area || 0} pixels\`)
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.bubbles },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
