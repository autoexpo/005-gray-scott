var e={title:`What is Reaction-Diffusion?`,chapter:1,math:`
<div class="math-section">
  <h3>Reaction-Diffusion Systems</h3>
  <p>A reaction-diffusion system models how two or more chemical species change
  in space and time through two competing processes:</p>

  <p><strong>Diffusion</strong> — molecules spread from high to low concentration,
  smoothing out spatial variation. Described by Fick's second law:</p>
  <div class="math-block">$$\\frac{\\partial c}{\\partial t} = D \\nabla^2 c$$</div>
  <span class="math-label">c = concentration, D = diffusion coefficient, ∇² = Laplacian operator</span>

  <p><strong>Reaction</strong> — species interact locally, transforming one into another.
  This creates and destroys concentration, producing spatial structure.</p>

  <p>The interplay creates <strong>Turing patterns</strong> — spontaneous, stable
  spatial patterns arising from a uniform homogeneous state.</p>
</div>

<div class="math-section">
  <h3>Biological Examples</h3>
  <p>Reaction-diffusion explains an extraordinary range of biological patterns:</p>
  <ul style="margin-left:16px; margin-top:6px; line-height:2">
    <li>Leopard and cheetah spots</li>
    <li>Zebra stripes</li>
    <li>Zebrafish pigmentation patterns</li>
    <li>Shell patterns (<em>Conus</em> cone snails)</li>
    <li>Fingerprint ridge patterns</li>
    <li>Limb/digit patterning in embryos</li>
    <li>Heart tissue wave propagation</li>
  </ul>
</div>

<div class="math-section">
  <h3>Alan Turing, 1952</h3>
  <p>In <em>"The Chemical Basis of Morphogenesis"</em>, Turing showed that
  a system stable to uniform perturbations can become unstable to spatially
  varying ones — if the inhibitor diffuses faster than the activator.</p>
  <div class="math-block">$$D_v > D_u \\implies \\text{diffusion-driven instability}$$</div>
  <p>This is the key insight behind all Turing patterns.</p>
</div>

<div class="math-section">
  <h3>The Gray-Scott Model</h3>
  <p>Proposed by Gray & Scott (1984), this model of an autocatalytic chemical
  reaction produces an extraordinary variety of patterns depending on two
  control parameters: the <strong>feed rate</strong> f and <strong>kill rate</strong> k.</p>
  <p>It is the primary subject of this course.</p>
</div>
`,code:`
<div class="code-section">
  <h3>Conceptual Structure</h3>
  <div class="filename">conceptual pseudocode</div>
<pre><code class="language-js">// A reaction-diffusion system tracks two fields:
//   u — "food" species (activator inhibitor)
//   v — "activator" species

// Each timestep, every cell:
//   1. Diffuses: spreads to neighbours
//   2. Reacts: u is consumed by v, v autocatalyses

function step(u, v, params) {
  for each cell (i, j):
    // Diffusion: Laplacian of concentration
    du = params.Du * laplacian(u, i, j)
    dv = params.Dv * laplacian(v, i, j)

    // Gray-Scott reaction
    reaction = u[i][j] * v[i][j] * v[i][j]
    du -= reaction
    dv += reaction

    // Feed: u is replenished
    du += params.f * (1 - u[i][j])

    // Kill: v is removed
    dv -= (params.f + params.k) * v[i][j]

    // Euler integration
    u_new[i][j] = u[i][j] + dt * du
    v_new[i][j] = v[i][j] + dt * dv
}
</code></pre>
</div>

<div class="code-section">
  <h3>The two key parameters</h3>
<pre><code class="language-js">// Feed rate f: how fast U is replenished
// — low f: system starves, patterns die
// — high f: system floods, patterns wash away
// — sweet spot: patterns form and persist

// Kill rate k: how fast V is removed
// — low k: V accumulates everywhere, no contrast
// — high k: V dies too fast to form structure
// — sweet spot: stable localized patterns

const PARAMS = {
  f: 0.055,  // feed rate
  k: 0.062,  // kill rate
  Du: 0.2097, // U diffusion coefficient
  Dv: 0.105,  // V diffusion coefficient (half of Du)
  dt: 1.0,    // time step
}
</code></pre>
</div>
`,init(e){let t=document.createElement(`div`);return t.style.cssText=`padding:24px; font-family:SF Mono,monospace; font-size:10pt; line-height:1.7`,t.innerHTML=`
<pre style="border:none; background:none; font-size:9pt; line-height:1.8">
  REACTION-DIFFUSION SYSTEM
  ─────────────────────────

  Species U (food/activator)
  Species V (activator/inhibitor)

  Du = 0.2097   Dv = 0.105
  ┌─────────────────────────┐
  │  Du >> Dv               │
  │  U diffuses 2× faster   │
  │  → Turing instability   │
  └─────────────────────────┘

  Reaction network:
  ─────────────────
  U + 2V → 3V     (autocatalysis)
  V → P           (kill / decay)
  ∅ → U           (feed)

  Each cell update:
  ─────────────────
  ∂u/∂t = Du·∇²u - u·v² + f·(1-u)
  ∂v/∂t = Dv·∇²v + u·v² - (f+k)·v

  Parameters:
  ─────────────────
  f ∈ [0.01, 0.12]  feed rate
  k ∈ [0.04, 0.07]  kill rate
  → different (f,k) → different patterns
</pre>
<div style="margin-top:20px; border-top:1px solid #000; padding-top:12px; color:#666; font-size:9pt">
  Use ← → arrows to navigate steps.<br>
  Press Space to pause simulation.<br>
  Mouse click+drag on viz to seed activator.
</div>`,e.appendChild(t),()=>{e.innerHTML=``}}};export{e as default};