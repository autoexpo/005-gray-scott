var e={title:`The Gray-Scott Equations`,chapter:1,math:`
<div class="math-section">
  <h3>The Gray-Scott Model — Full PDE System</h3>
  <p>The model tracks two chemical concentrations over time and space:</p>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li><strong>U(x,y,t)</strong> — the "food" species, fed from outside</li>
    <li><strong>V(x,y,t)</strong> — the "activator" species, autocatalytic</li>
  </ul>
</div>

<div class="math-section">
  <h3>Partial Differential Equations</h3>
  <div class="math-block">$$\\frac{\\partial U}{\\partial t} = D_U \\nabla^2 U \\underbrace{- UV^2}_{\\text{reaction}} + \\underbrace{f(1 - U)}_{\\text{feed}}$$</div>
  <div class="math-block">$$\\frac{\\partial V}{\\partial t} = D_V \\nabla^2 V \\underbrace{+ UV^2}_{\\text{reaction}} - \\underbrace{(f+k)V}_{\\text{kill}}$$</div>
</div>

<div class="math-section">
  <h3>Term-by-Term Explanation</h3>

  <p><strong>$D_U \\nabla^2 U$</strong> — diffusion of U. The Laplacian ∇²U measures how
  the local U value differs from its spatial average. If U is high here and low nearby,
  this term pushes U outward.</p>

  <p><strong>$-UV^2$</strong> — reaction: one U molecule combines with two V molecules to
  produce three V. This is the <em>autocatalytic</em> step: V catalyses its own production
  at rate proportional to U·V².</p>

  <p><strong>$f(1-U)$</strong> — feed: U is continuously replenished toward concentration 1.
  When U=1 the feed is zero; when U=0 the feed rate is f.</p>

  <p><strong>$D_V \\nabla^2 V$</strong> — diffusion of V. Same form as U but with smaller
  coefficient $D_V < D_U$.</p>

  <p><strong>$(f+k)V$</strong> — kill: V is continuously removed at rate (f+k).
  The extra k beyond f represents the decay of V into an inert product P.</p>
</div>

<div class="math-section">
  <h3>Parameter Ranges</h3>
  <div class="math-block">$$D_U = 0.2097, \\quad D_V = 0.105$$</div>
  <div class="math-block">$$f \\in [0.01, 0.12], \\quad k \\in [0.04, 0.08]$$</div>
  <p>The ratio $D_U/D_V = 2$ is critical — it creates the instability.</p>
</div>
`,code:`
<div class="code-section">
  <h3>Direct JavaScript Translation</h3>
  <div class="filename">src/cpu/Integrator.js (excerpt)</div>
<pre><code class="language-js">// Exact transcription of the Gray-Scott PDEs
// for a single cell at index i.

function grayScottDerivatives(u, v, lapU, lapV, p) {
  const { f, k, Du, Dv } = p

  // Autocatalytic reaction term
  const uvv = u * v * v   // u·v²

  // ∂U/∂t
  const du = Du * lapU    // diffusion
           - uvv          // consumed in reaction
           + f * (1 - u)  // replenished by feed

  // ∂V/∂t
  const dv = Dv * lapV    // diffusion
           + uvv          // produced in reaction
           - (f + k) * v  // killed

  return { du, dv }
}

// Euler integration (forward Euler, O(dt) accurate)
function eulerStep(u, v, lapU, lapV, p) {
  const { du, dv } = grayScottDerivatives(u, v, lapU, lapV, p)
  return {
    uNew: u + p.dt * du,
    vNew: v + p.dt * dv,
  }
}
</code></pre>
</div>

<div class="code-section">
  <h3>Note on Units</h3>
<pre><code class="language-js">// In the Gray-Scott model, concentrations are
// dimensionless and normalized to [0, 1]:
//   U = 1.0 means maximum food concentration
//   U = 0.0 means food is depleted
//   V = 1.0 means maximum activator

// The Laplacian is computed on a unit grid (h=1),
// so the diffusion coefficients Du, Dv already
// absorb the 1/h² factor from finite differences.

// After each step, clamp to prevent overshoot:
uNew = Math.max(0, Math.min(1, uNew))
vNew = Math.max(0, Math.min(1, vNew))
</code></pre>
</div>
`,init(e){let t=document.createElement(`div`);return t.style.cssText=`padding:24px; font-family:SF Mono,monospace; font-size:10pt;`,t.innerHTML=`
<pre style="border:none; background:none; font-size:9pt; line-height:1.9">
  THE GRAY-SCOTT EQUATIONS
  ════════════════════════

  ∂U   = Du·∇²U  − U·V²  +  f·(1−U)
  ──
  ∂t   diffusion  reaction  feed

  ∂V   = Dv·∇²V  + U·V²  − (f+k)·V
  ──
  ∂t   diffusion  reaction  kill

  ────────────────────────────────────
  Sign convention:
  ─U·V²  →  U decreases (consumed)
  +U·V²  →  V increases (produced)

  Steady state (no spatial structure):
  ─────────────────────────────────────
  At equilibrium: ∂U/∂t = ∂V/∂t = 0
  Without reaction: U=1, V=0
  With reaction: depends on (f,k)
</pre>`,e.appendChild(t),()=>{e.innerHTML=``}}};export{e as default};