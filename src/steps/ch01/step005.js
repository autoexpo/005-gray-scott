/**
 * Step 5: Reaction alone — autocatalysis, the U·V² term.
 */
import { makeCanvas2D } from '../../utils/canvas2d.js'

export default {
  title: 'Reaction: Autocatalysis',
  chapter: 1,

  math: `
<div class="math-section">
  <h3>Chemical Kinetics</h3>
  <p>The Gray-Scott model is based on an autocatalytic reaction scheme:
  a product V catalyses its own production from the substrate U.</p>
</div>

<div class="math-section">
  <h3>Reaction Network</h3>
  <div class="math-block">$$U + 2V \\xrightarrow{k_1} 3V$$</div>
  <div class="math-block">$$V \\xrightarrow{k_2} P \\text{ (inert)}$$</div>
  <div class="math-block">$$\\emptyset \\xrightarrow{f} U$$</div>
  <p>The first reaction: one U molecule reacts with two V molecules to produce
  three V. This is the "cubic autocatalysis" — V autocatalyses its own production
  at a rate cubic in concentrations (first-order in U, second-order in V).</p>
</div>

<div class="math-section">
  <h3>Mass Action Kinetics</h3>
  <p>By the law of mass action, the reaction rate is proportional to the product
  of reactant concentrations:</p>
  <div class="math-block">$$r = k_1 \\cdot [U][V]^2 = UV^2$$</div>
  <p>(setting k₁=1 for simplicity in the dimensionless model)</p>

  <p>This gives the reaction terms:</p>
  <div class="math-block">$$\\frac{dU}{dt}\\Big|_{\\text{rxn}} = -UV^2 \\quad \\text{(U consumed)}$$</div>
  <div class="math-block">$$\\frac{dV}{dt}\\Big|_{\\text{rxn}} = +UV^2 \\quad \\text{(V produced)}$$</div>
</div>

<div class="math-section">
  <h3>Behaviour without Diffusion</h3>
  <p>In a single well-mixed cell, if U is plentiful (U≈1) and V is seeded:</p>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>V grows rapidly via autocatalysis (UV² is large when U≈1)</li>
    <li>U is consumed, drops toward 0</li>
    <li>As U→0, reaction slows (not enough substrate)</li>
    <li>V is simultaneously removed by the kill term (f+k)V</li>
    <li>The system reaches a steady state or oscillates depending on (f,k)</li>
  </ul>
</div>
`,

  code: `
<div class="code-section">
  <h3>Reaction Only (no diffusion, ODE system)</h3>
<pre><code class="language-js">// Single-cell Gray-Scott: pure reaction, no spatial terms.
// This is an ODE (ordinary differential equation) rather than a PDE.

function reactionOnly(u, v, params) {
  const { f, k, dt } = params

  // Autocatalytic reaction rate
  const uvv = u * v * v   // UV²

  // du/dt: reaction + feed
  const du = -uvv + f * (1 - u)

  // dv/dt: reaction - kill
  const dv = +uvv - (f + k) * v

  return {
    u: Math.max(0, u + dt * du),
    v: Math.max(0, v + dt * dv),
  }
}

// Trace trajectory from seed state
let u = 1.0, v = 0.1  // slight V perturbation
const trace = []
for (let t = 0; t < 2000; t++) {
  ({ u, v } = reactionOnly(u, v, { f: 0.055, k: 0.062, dt: 1.0 }))
  trace.push({ u, v })
}
</code></pre>
</div>

<div class="code-section">
  <h3>Phase Plane Intuition</h3>
<pre><code class="language-js">// The (U,V) phase plane shows all possible trajectories.
// Fixed points satisfy du/dt = 0 AND dv/dt = 0.

// For the trivial state (U=1, V=0):
//   du/dt = -1*0*0 + f*(1-1) = 0  ✓
//   dv/dt = +1*0*0 - (f+k)*0 = 0  ✓
// → Always a fixed point (the "food-only" state)

// Non-trivial fixed points (patterns) exist for
// certain (f,k) combinations — these are what
// Turing instability theory predicts.
</code></pre>
</div>
`,

  init(container) {
    const { canvas, disconnect } = makeCanvas2D(container, false)
    const ctx = canvas.getContext('2d')
    let animId

    // Trace for multiple (f,k) pairs
    const configs = [
      { f: 0.055, k: 0.062, label: 'f=0.055 k=0.062 (spots)' },
      { f: 0.028, k: 0.053, label: 'f=0.028 k=0.053 (mitosis)' },
      { f: 0.035, k: 0.065, label: 'f=0.035 k=0.065 (stable)' },
    ]
    const traces = configs.map(cfg => {
      let u = 1.0, v = 0.05
      const pts = []
      for (let t = 0; t < 3000; t++) {
        const uvv = u * v * v
        const du = -uvv + cfg.f * (1 - u)
        const dv = uvv - (cfg.f + cfg.k) * v
        u = Math.max(0, Math.min(1, u + du))
        v = Math.max(0, Math.min(1, v + dv))
        if (t % 5 === 0) pts.push({ u, v })
      }
      return { pts, label: cfg.label }
    })

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, W, H)

      const pad = 30
      const pw = W - pad*2, ph = H - pad*2 - 30

      // Axes
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad - 30)
      ctx.moveTo(pad, H - pad - 30); ctx.lineTo(W - pad, H - pad - 30)
      ctx.stroke()

      ctx.fillStyle = '#888'
      ctx.font = '9pt SF Mono, monospace'
      ctx.fillText('U (food)', W/2 - 20, H - 10)
      ctx.fillText('V (activator)', 2, H/2)
      ctx.fillText('Phase plane: reaction only (no diffusion)', pad, pad - 6)

      // Phase trajectories
      traces.forEach((tr, ti) => {
        ctx.strokeStyle = ['#000', '#555', '#999'][ti]
        ctx.lineWidth = 1
        ctx.beginPath()
        tr.pts.forEach((pt, i) => {
          const x = pad + pt.u * pw
          const y = H - pad - 30 - pt.v * ph
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        })
        ctx.stroke()

        // Label
        const last = tr.pts[tr.pts.length - 1]
        ctx.fillStyle = '#555'
        ctx.font = '8pt monospace'
        ctx.fillText('•', pad + last.u * pw, H - pad - 30 - last.v * ph)
      })

      // Legend
      traces.forEach((tr, ti) => {
        const y = pad + 16 + ti * 14
        ctx.fillStyle = ['#000', '#555', '#999'][ti]
        ctx.font = '8pt monospace'
        ctx.fillText(tr.label, pad + 4, y)
      })
    }

    requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      disconnect()
      container.innerHTML = ''
    }
  }
}
