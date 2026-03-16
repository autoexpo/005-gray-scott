/**
 * Step 54: Preset — Coral (f=0.059, k=0.062)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Coral (f=0.059, k=0.062)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Dendritic Branching — Coral-like Tree Structures</h3>
  <p>At f=0.059, k=0.062, the system produces intricate branching patterns resembling
  coral growth or river deltas. These structures exhibit dendritic morphology —
  tree-like branching with progressively finer subdivisions.</p>
</div>

<div class="math-section">
  <h3>Connection to Diffusion-Limited Aggregation (DLA)</h3>
  <p>Gray-Scott coral patterns share mathematical principles with DLA models:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Growth occurs at the tips of existing structures</li>
    <li>Diffusion brings substrate (U) to the growing interface</li>
    <li>Random fluctuations select which tips grow fastest</li>
    <li>Screening effects suppress growth in sheltered regions</li>
  </ul>
</div>

<div class="math-section">
  <h3>Fractal Branching</h3>
  <p>The branching patterns exhibit fractal geometry — similar structure at multiple
  scales. Zooming into a branch reveals sub-branches with similar morphology.
  This scale invariance is a hallmark of diffusion-limited growth processes.</p>
</div>

<div class="math-section">
  <h3>Why DLA Produces Similar Structures to RD Systems</h3>
  <p>Both DLA and Gray-Scott systems are governed by diffusion-limited growth:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Growth rate ∝ local concentration gradient</li>
    <li>Screening effects from existing structure</li>
    <li>Stochastic branching due to noise amplification</li>
    <li>Self-similar fractal morphology</li>
  </ul>
</div>

<div class="math-section">
  <h3>The Hausdorff Dimension of Coral Patterns</h3>
  <p>The fractal dimension of Gray-Scott coral structures is approximately:</p>
  <div class="math-block">$$D_f \\approx 1.7$$</div>
  <p>This is intermediate between a 1D line (D=1) and a 2D surface (D=2),
  indicating the space-filling nature of the branching structure.</p>
</div>

<div class="math-section">
  <h3>Branching Angle Statistics</h3>
  <p>The angles between branches follow statistical distributions similar to
  those observed in real coral growth. Typical branching angles range from
  30° to 60°, optimized for efficient space exploration and nutrient capture.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Coral Preset</h3>
<pre><code class="language-js">// From parameters.js
coral: {
  label: 'Coral / Branching',
  f: 0.059,    // similar to stripes but slightly lower
  k: 0.062,    // same as stripes
  Du: 0.2097,  // standard diffusion
  Dv: 0.105,
  dt: 1.0,
  description: 'Dendritic branching patterns like coral growth.',
}

// Close to stripes (f=0.060, k=0.062) but the subtle difference
// creates branching instead of continuous stripes
</code></pre>
</div>

<div class="code-section">
  <h3>Skeleton Extraction Algorithm Outline</h3>
<pre><code class="language-js">// Extract the branching skeleton from coral patterns
// This is a conceptual outline of the thinning operation

function skeletonize(binaryImage, width, height) {
  // Zhang-Suen thinning algorithm (iterative)
  let image = new Uint8Array(binaryImage) // copy
  let changed = true

  while (changed) {
    changed = false

    // Two sub-iterations for proper thinning
    for (let subiter = 0; subiter < 2; subiter++) {
      const toRemove = []

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x

          if (image[idx] === 1) {
            // Check 8-neighbors
            const neighbors = getNeighbors(image, width, x, y)

            // Zhang-Suen conditions:
            // 1. 2 <= N(P1) <= 6 (number of non-zero neighbors)
            // 2. S(P1) = 1 (exactly one 0->1 transition)
            // 3. P2 * P4 * P6 = 0 (specific pattern)
            // 4. P4 * P6 * P8 = 0 (specific pattern)

            if (zhangSuenConditions(neighbors, subiter)) {
              toRemove.push(idx)
            }
          }
        }
      }

      // Remove marked pixels
      for (const idx of toRemove) {
        image[idx] = 0
        changed = true
      }
    }
  }

  return image
}

// The skeleton reveals the branching topology:
// - Branch points (pixels with >2 neighbors)
// - End points (pixels with 1 neighbor)
// - Branch segments (chains between junctions)

function analyzeSkeleton(skeleton, width, height) {
  const branchPoints = []
  const endPoints = []

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x

      if (skeleton[idx] === 1) {
        const neighbors = countSkeletonNeighbors(skeleton, width, x, y)

        if (neighbors === 1) {
          endPoints.push({ x, y })
        } else if (neighbors > 2) {
          branchPoints.push({ x, y, degree: neighbors })
        }
      }
    }
  }

  return {
    branchPoints,
    endPoints,
    branchingRatio: branchPoints.length / endPoints.length
  }
}
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.coral },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
