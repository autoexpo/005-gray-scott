/**
 * Step 50: Preset — Stripes (f=0.060, k=0.062)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Stripes (f=0.060, k=0.062)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Stripe (Labyrinthine) Pattern Region</h3>
  <p>At f=0.060, k=0.062, the system produces connected stripe patterns instead of isolated spots.
  The higher feed rate f provides more U substrate, allowing patterns to connect into
  labyrinthine networks rather than remaining as isolated domains.</p>
</div>

<div class="math-section">
  <h3>Why Stripes Instead of Spots</h3>
  <p>The transition from spots to stripes occurs as f increases. Higher feed rates
  create a richer U environment, reducing competition between neighboring pattern
  elements. This allows them to merge and form connected structures.</p>
</div>

<div class="math-section">
  <h3>Connection to Animal Coat Markings</h3>
  <p>Stripe patterns in Gray-Scott closely resemble zebra and tiger coat patterns.
  In biological development, similar reaction-diffusion processes during embryogenesis
  create these striking patterns. The mathematical principles are identical.</p>
</div>

<div class="math-section">
  <h3>The Role of Du/Dv Ratio in Selecting Spot vs Stripe</h3>
  <p>The diffusion ratio Du/Dv ≈ 2 is crucial for stripe formation. If Du were much
  larger, patterns would be too diffuse. If Dv were larger, patterns would fragment
  into spots. The specific ratio Du/Dv ≈ 2 provides the right balance for connected
  stripe morphology.</p>
</div>

<div class="math-section">
  <h3>Stripe Wavelength Calculation</h3>
  <p>The stripe width λ can be estimated from the linear stability analysis:</p>
  <div class="math-block">$$\\lambda_{stripe} \\approx \\frac{2\\pi}{q^*} \\sqrt{\\frac{D_u}{D_v}}$$</div>
  <p>For the stripe preset, this gives a characteristic width of approximately 15-20
  simulation units.</p>
</div>

<div class="math-section">
  <h3>Comparison to Turing's Original 1952 Predictions</h3>
  <p>Alan Turing's seminal 1952 paper predicted exactly this type of pattern.
  His mathematical analysis showed that reaction-diffusion systems could spontaneously
  break symmetry and create periodic spatial patterns. The Gray-Scott stripe patterns
  are a direct realization of Turing's theoretical predictions.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>The Stripes Preset</h3>
<pre><code class="language-js">// From parameters.js
stripes: {
  label: 'Stripes / Labyrinths',
  f: 0.060,    // higher feed rate than spots
  k: 0.062,    // slightly lower kill rate
  Du: 0.2097,  // same diffusion coefficients
  Dv: 0.105,
  dt: 1.0,
  description: 'Labyrinthine stripe patterns. Animal coat markings.',
}

// Compare to spots:
// spots:   f=0.035, k=0.065  (isolated)
// stripes: f=0.060, k=0.062  (connected)
// The higher f allows pattern connection
</code></pre>
</div>

<div class="code-section">
  <h3>How Stripes Differ from Spots in (f,k) Diagram</h3>
<pre><code class="language-js">// Parameter space comparison
const spotRegion = { f: 0.035, k: 0.065 }    // isolated spots
const stripeRegion = { f: 0.060, k: 0.062 }  // connected stripes

// The trajectory in parameter space:
// Starting from spots (0.035, 0.065)
// → increase f by +0.025 (more feed)
// → decrease k by -0.003 (less kill)
// → result: spots merge into stripes

// This movement in (f,k) space crosses a bifurcation boundary
// where the pattern topology changes qualitatively
</code></pre>
</div>

<div class="code-section">
  <h3>JavaScript to Measure Stripe Spacing</h3>
<pre><code class="language-js">// Analyze stripe spacing from the U concentration array
function measureStripeSpacing(uData, width, height) {
  // Take a horizontal line through the middle
  const midRow = Math.floor(height / 2)
  const lineData = []

  for (let x = 0; x < width; x++) {
    const idx = midRow * width + x
    lineData.push(uData[idx])
  }

  // Find peaks and valleys (threshold crossing method)
  const threshold = 0.5
  const crossings = []

  for (let i = 1; i < lineData.length; i++) {
    if ((lineData[i-1] < threshold && lineData[i] >= threshold) ||
        (lineData[i-1] >= threshold && lineData[i] < threshold)) {
      crossings.push(i)
    }
  }

  // Average spacing between crossings
  const spacings = []
  for (let i = 1; i < crossings.length; i++) {
    spacings.push(crossings[i] - crossings[i-1])
  }

  const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length
  return {
    avgSpacing,
    numStripes: Math.floor(width / avgSpacing),
    crossings: crossings.length
  }
}

// Usage in animation loop:
// const spacing = measureStripeSpacing(sim.getU(), 256, 256)
// console.log(\`Stripe spacing: \${spacing.avgSpacing.toFixed(1)} pixels\`)
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.stripes },
      size: 256,
      stepsPerFrame: 16,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
