import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";import{t as a}from"./simControls-D-DGtL0_.js";var o={title:`Diffusion: Fick's Law`,chapter:1,math:`
<div class="math-section">
  <h3>Fick's Second Law of Diffusion</h3>
  <p>Diffusion describes the spreading of a quantity from regions of high concentration
  to regions of low concentration. In 1D:</p>
  <div class="math-block">$$\\frac{\\partial c}{\\partial t} = D \\frac{\\partial^2 c}{\\partial x^2}$$</div>
  <p>In 2D (and higher), the second derivative generalizes to the Laplacian:</p>
  <div class="math-block">$$\\frac{\\partial c}{\\partial t} = D \\nabla^2 c = D \\left(\\frac{\\partial^2 c}{\\partial x^2} + \\frac{\\partial^2 c}{\\partial y^2}\\right)$$</div>
</div>

<div class="math-section">
  <h3>Physical Intuition</h3>
  <p>The Laplacian $\\nabla^2 c$ measures the <em>deviation</em> of the local value from
  the spatial average of its neighbours:</p>
  <div class="math-block">$$\\nabla^2 c \\approx \\frac{\\bar{c}_{\\text{neighbours}} - c_{\\text{local}}}{h^2/4}$$</div>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>If $c_{\\text{local}} > \\bar{c}$: ∇²c < 0 → concentration decreases (flows out)</li>
    <li>If $c_{\\text{local}} < \\bar{c}$: ∇²c > 0 → concentration increases (flows in)</li>
    <li>If $c_{\\text{local}} = \\bar{c}$: ∇²c = 0 → no change</li>
  </ul>
</div>

<div class="math-section">
  <h3>Analytical Solution (1D Gaussian)</h3>
  <p>Starting from a Dirac delta $c(x,0) = \\delta(x)$, the solution is a Gaussian
  that spreads over time:</p>
  <div class="math-block">$$c(x,t) = \\frac{1}{\\sqrt{4\\pi D t}} \\exp\\!\\left(-\\frac{x^2}{4Dt}\\right)$$</div>
  <p>Width grows as $\\sigma = \\sqrt{2Dt}$ — the characteristic diffusion length.</p>
</div>

<div class="math-section">
  <h3>CFL Stability Condition</h3>
  <p>For stable explicit (Euler) integration in 1D with grid spacing h:</p>
  <div class="math-block">$$\\Delta t \\leq \\frac{h^2}{2D}$$</div>
  <p>In 2D: $\\Delta t \\leq \\frac{h^2}{4D}$. With h=1, D=0.2097: dt ≤ 2.38 (1D), dt ≤ 1.19 (2D).</p>
</div>
`,code:`
<div class="code-section">
  <h3>1D Diffusion: Euler Step</h3>
  <div class="filename">1D heat equation demo</div>
<pre><code class="language-js">const N = 200     // grid points
const D = 0.2     // diffusion coefficient
const dt = 0.4    // time step (< h²/2D = 2.5)
const dx = 1.0    // grid spacing

// Initialize: spike at center
const c = new Float32Array(N).fill(0)
c[Math.floor(N/2)] = 1.0

function diffuseStep(c) {
  const next = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    // 1D finite-difference Laplacian:
    // ∂²c/∂x² ≈ (c[i-1] - 2c[i] + c[i+1]) / dx²
    const left  = c[(i - 1 + N) % N]  // periodic BC
    const right = c[(i + 1) % N]
    const lap = (left - 2 * c[i] + right) / (dx * dx)
    next[i] = c[i] + dt * D * lap
  }
  return next
}

// Animate
let current = c
function animate() {
  for (let s = 0; s < 3; s++)
    current = diffuseStep(current)
  draw(current)   // update canvas
  requestAnimationFrame(animate)
}
</code></pre>
</div>

<div class="code-section">
  <h3>Note: Laplacian = local deviation</h3>
<pre><code class="language-js">// The 1D Laplacian at index i:
//   lap = c[i-1] - 2*c[i] + c[i+1]
//       = (c[i-1] + c[i+1])/2 - c[i]
//           ↑ neighbour average      ↑ local value
//       = deviation from local mean

// If the cell is higher than its neighbours:
//   lap < 0  →  the cell loses concentration
// If lower than neighbours:
//   lap > 0  →  the cell gains concentration
// Result: concentration spreads until uniform.
</code></pre>
</div>
`,init(o){let s={top:20,right:20,bottom:40,left:50},c=512-s.left-s.right,l=512-s.top-s.bottom,u=r(o).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${s.left},${s.top})`),d=e().domain([0,1]).range([0,c]),f=e().domain([0,1]).range([l,0]);u.append(`g`).attr(`transform`,`translate(0,${l})`).call(n(d).ticks(5)),u.append(`g`).call(t(f).ticks(5)),u.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),u.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),u.append(`text`).attr(`x`,c).attr(`y`,l+35).style(`text-anchor`,`end`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`x`),u.append(`text`).attr(`x`,-10).attr(`y`,-5).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`c`);let p=u.append(`text`).attr(`x`,4).attr(`y`,15).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),m=u.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),h=.3,g=new Float32Array(200).fill(0);g[100]=1;let _=0,v,y=!1;function b(){g.fill(0),g[100]=1,_=0}let x=a(o,{onPause:e=>{y=e},onReplay:()=>{b()}});function S(){let e=new Float32Array(200);for(let t=0;t<200;t++){let n=g[(t-1+200)%200],r=g[(t+1)%200];e[t]=Math.max(0,g[t]+h*.2*(n-2*g[t]+r))}g=e,_+=h}function C(){let e=Array.from(g).map((e,t)=>[t/199,e]),t=i().x(e=>d(e[0])).y(e=>f(e[1]));m.attr(`d`,t(e)),p.text(`D·∇²c  t=${_.toFixed(1)}`)}function w(){if(v=requestAnimationFrame(w),!y){for(let e=0;e<4;e++)S();_>500&&b()}C()}return C(),w(),()=>{cancelAnimationFrame(v),x.remove(),r(o).select(`#d3-sim`).remove()}}};export{o as default};