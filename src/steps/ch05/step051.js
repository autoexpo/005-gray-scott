/**
 * Step 51: Preset — Worms (f=0.078, k=0.061)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Worms (f=0.078, k=0.061)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Worm-like Patterns are Long Connected Stripes</h3>
  <p>At f=0.078, k=0.061, the system produces elongated, worm-like structures.
  These represent an intermediate state between the connected stripes (f=0.060)
  and the bubble domains (f=0.098). The worms are highly dynamic, constantly
  reorganizing and flowing like living entities.</p>
</div>

<div class="math-section">
  <h3>Why They Differ from Pure Stripes</h3>
  <p>The higher feed rate f=0.078 (compared to f=0.060 for stripes) provides
  even more U substrate. This abundance allows pattern regions to grow larger
  and more irregular. Instead of maintaining regular stripe width, the patterns
  become elongated and variable in thickness.</p>
</div>

<div class="math-section">
  <h3>The Transition from Stripes to Worms as f Increases</h3>
  <p>Moving through parameter space:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>f=0.060: Regular stripe width, periodic structure</li>
    <li>f=0.070: Stripes begin to vary in width</li>
    <li>f=0.078: Elongated worms, highly variable morphology</li>
    <li>f=0.090: Approaching bubble regime</li>
  </ul>
</div>

<div class="math-section">
  <h3>Space-Filling Curve Properties</h3>
  <p>Worm patterns exhibit space-filling curve characteristics — they create
  long, connected paths that efficiently explore the available 2D space while
  maintaining connectivity. This gives them a high perimeter-to-area ratio.</p>
</div>

<div class="math-section">
  <h3>Fractal Dimension of the Worm Boundary</h3>
  <p>The boundary between U-rich (worm) and U-poor regions has a fractal
  dimension approximately 1.5. This can be measured using the box-counting method:</p>
  <div class="math-block">$$D_f = \\lim_{\\epsilon \\to 0} \\frac{\\log N(\\epsilon)}{\\log(1/\\epsilon)} \\approx 1.5$$</div>
  <p>where N(ε) is the number of boxes of size ε needed to cover the boundary.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Worms Preset</h3>
<pre><code class="language-js">// From parameters.js
worms: {
  label: 'Worms',
  f: 0.078,    // higher feed rate than stripes
  k: 0.061,    // similar kill rate
  Du: 0.2097,  // standard diffusion coefficients
  Dv: 0.105,
  dt: 1.0,
  description: 'Worm-like structures filling the space.',
}

// Parameter progression:
// stripes: f=0.060, k=0.062  → regular stripes
// worms:   f=0.078, k=0.061  → elongated worms
// bubbles: f=0.098, k=0.057  → bubble domains
</code></pre>
</div>

<div class="code-section">
  <h3>How to Measure Connected Component Properties</h3>
<pre><code class="language-js">// Analyze worm connectivity and shape properties
function analyzeWormComponents(uData, width, height, threshold = 0.5) {
  // Convert to binary image
  const binary = new Uint8Array(width * height)
  for (let i = 0; i < uData.length; i++) {
    binary[i] = uData[i] > threshold ? 1 : 0
  }

  // Connected component labeling (flood fill)
  const labels = new Int32Array(width * height).fill(0)
  let componentId = 1

  const components = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (binary[idx] === 1 && labels[idx] === 0) {
        // Start new component
        const component = floodFill(binary, labels, width, height, x, y, componentId)
        if (component.size > 10) { // ignore tiny components
          components.push({
            id: componentId,
            size: component.size,
            perimeter: component.perimeter,
            boundingBox: component.boundingBox,
            aspectRatio: component.boundingBox.width / component.boundingBox.height
          })
        }
        componentId++
      }
    }
  }

  return {
    numComponents: components.length,
    totalArea: components.reduce((sum, c) => sum + c.size, 0),
    avgAspectRatio: components.reduce((sum, c) => sum + c.aspectRatio, 0) / components.length,
    largestComponent: components.reduce((max, c) => c.size > max.size ? c : max, {size: 0})
  }
}

// Worms typically have:
// - Few large components (1-3 major worms)
// - High aspect ratios (length >> width)
// - Large total connected area
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.worms },
      size: 256,
      stepsPerFrame: 16,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
