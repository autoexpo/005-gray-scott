/**
 * Step 49: Preset — Spots (f=0.035, k=0.065)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset — Spots (f=0.035, k=0.065)',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Why Spots Form at this (f,k)</h3>
  <p>At f=0.035, k=0.065, the system sits in the Turing instability region where
  the uniform state (U=1, V=0) is unstable to spatial perturbations. The linear
  stability analysis predicts that patterns with a specific wavelength λ will grow
  exponentially from small random fluctuations.</p>
</div>

<div class="math-section">
  <h3>Turing Instability Analysis</h3>
  <p>For the Gray-Scott system, the characteristic equation for perturbations with
  wavenumber q is:</p>
  <div class="math-block">$$\\lambda(q) = -(D_u + D_v)q^2 + \\Delta + \\sqrt{\\Delta^2 + 4D_uD_v q^2}$$</div>
  <p>where Δ = f - (f+k) = -k at the uniform steady state. The instability occurs
  when λ(q*) > 0 for some critical wavenumber q*.</p>
</div>

<div class="math-section">
  <h3>Hexagonal Lattice Arrangement at Equilibrium</h3>
  <p>Spots naturally arrange themselves in a hexagonal lattice to minimize
  competition for the U substrate. This hexagonal packing maximizes the distance
  between neighboring spots while maintaining uniform spatial density.</p>
</div>

<div class="math-section">
  <h3>Spot Radius as Function of Du/Dv</h3>
  <p>The spot radius R scales with the diffusion ratio:</p>
  <div class="math-block">$$R \\propto \\sqrt{\\frac{D_u}{D_v}} \\approx \\sqrt{2} \\text{ (for standard values)}$$</div>
  <p>Since Du ≈ 2Dv in the standard parameter set, spots have a characteristic
  size determined by the diffusion length of the inhibitor V.</p>
</div>

<div class="math-section">
  <h3>Comparison to Animal Skin Patterns</h3>
  <p>The Gray-Scott spot pattern closely resembles leopard and cheetah coat patterns.
  In biological systems, the same mathematical principles apply: an activator-inhibitor
  system with short-range activation and long-range inhibition produces isolated spots.</p>
</div>

<div class="math-section">
  <h3>The Pearson (1993) "Alpha" Region</h3>
  <p>John Pearson's original classification labeled this parameter region as "α"
  (alpha). It represents the classic example of Turing pattern formation and
  remains one of the most studied regions in the Gray-Scott parameter space.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>The Spots Preset Values</h3>
<pre><code class="language-js">// From parameters.js
spots: {
  label: 'Spots',
  f: 0.035,    // feed rate
  k: 0.065,    // kill rate
  Du: 0.2097,  // U diffusion coefficient
  Dv: 0.105,   // V diffusion coefficient
  dt: 1.0,     // time step size
  description: 'Isolated spots (coral-like). Classic Turing pattern.',
}

// Usage:
const spotParams = { ...PRESETS.spots }
console.log(spotParams.f, spotParams.k)  // 0.035, 0.065
</code></pre>
</div>

<div class="code-section">
  <h3>Theoretical Spot Spacing Calculation</h3>
<pre><code class="language-js">// Compute the dominant wavenumber from dispersion relation
function computeSpotSpacing(params) {
  const { f, k, Du, Dv } = params

  // Linear stability analysis gives the most unstable wavenumber
  // This is a simplified approximation
  const qStar = Math.sqrt(k / (2 * Math.sqrt(Du * Dv)))

  // Convert to real-space wavelength
  const lambda = 2 * Math.PI / qStar

  // In grid units (for 256×256 simulation)
  const lambdaGrid = lambda * 256 / (2 * Math.PI)

  return {
    qStar,
    lambda,
    lambdaGrid,
    expectedSpots: Math.floor((256 / lambdaGrid) ** 2)
  }
}

const spacing = computeSpotSpacing(PRESETS.spots)
console.log(\`Expected spot spacing: \${spacing.lambdaGrid.toFixed(1)} pixels\`)
</code></pre>
</div>

<div class="code-section">
  <h3>KaTeX Formula for Spot Wavelength</h3>
<pre><code class="language-js">// The theoretical spot spacing formula in LaTeX notation:
const spotFormula = \`
The dominant wavelength λ* is given by:
$$\\lambda^* = \\frac{2\\pi}{q^*}$$
where the critical wavenumber q* satisfies:
$$q^* = \\sqrt{\\frac{k}{2\\sqrt{D_u D_v}}}$$

For the spots preset (f=0.035, k=0.065, Du=0.2097, Dv=0.105):
$$q^* \\approx \\sqrt{\\frac{0.065}{2\\sqrt{0.2097 \\times 0.105}}} \\approx 0.56$$
$$\\lambda^* \\approx \\frac{2\\pi}{0.56} \\approx 11.2 \\text{ simulation units}$$
\`
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 16,
      vizMode: 'bw',
      showGui: true,
    })
  }
}
