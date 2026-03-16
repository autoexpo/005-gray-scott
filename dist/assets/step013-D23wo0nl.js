var e={title:`1D Animation Loop`,chapter:2,math:`<div class="math-section"><h3>The Animation Loop</h3>
<p>requestAnimationFrame provides ~60fps timing. We run multiple simulation steps
per frame (sub-stepping) to make the simulation progress at a visible rate.</p>
<div class="math-block">$$\\text{wall-clock rate} = \\frac{\\text{steps/frame} \\times 60}{\\Delta t} \\approx \\frac{8 \\times 60}{1} = 480 \\text{ sim-units/sec}$$</div>
<p>Gray-Scott patterns typically fully develop in 5,000–50,000 time units, so
sub-stepping by 8–16× is needed for visible progress.</p>
</div>`,code:`<div class="code-section"><h3>Sub-stepped Animation Loop</h3>
<pre><code class="language-js">const STEPS_PER_FRAME = 8

function animate() {
  requestAnimationFrame(animate)

  // Sub-step: multiple sim steps per RAF
  for (let s = 0; s < STEPS_PER_FRAME; s++) {
    eulerStep(grid, params)
  }

  // Render current state to canvas
  draw(grid.u)
}
animate()
</code></pre></div>`,init(e){let t=document.createElement(`div`);return t.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:9pt`,t.innerHTML=`<pre style="border:none;background:none;line-height:1.8">
  ANIMATION LOOP STRUCTURE
  ════════════════════════

  browser
  ─────────────────────────────────────
  requestAnimationFrame(animate)
    │
    ├─ for s = 0..stepsPerFrame-1:
    │    eulerStep(grid, params)
    │    → reads from u[], v[]
    │    → writes to u2[], v2[]
    │    → swaps buffers
    │
    └─ draw(u) → ImageData → canvas

  timing:
  ─────────────────────────────────────
  1 frame ≈ 16.67ms at 60fps
  8 steps × 1.0 dt = 8 sim-time-units/frame
  60fps × 8 = 480 sim-time-units/second
  patterns form at ~5000 time-units
  → visible in ~10 seconds at 8 spf
</pre>`,e.appendChild(t),()=>{e.innerHTML=``}}};export{e as default};