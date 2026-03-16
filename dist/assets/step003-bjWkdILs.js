import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";var a={title:`Diffusion: Fick's Law`,chapter:1,math:`
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
`,init(a){let o={top:20,right:20,bottom:40,left:50},s=512-o.left-o.right,c=512-o.top-o.bottom,l=r(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=e().domain([0,1]).range([0,s]),d=e().domain([0,1]).range([c,0]);l.append(`g`).attr(`transform`,`translate(0,${c})`).call(n(u).ticks(5)),l.append(`g`).call(t(d).ticks(5)),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),l.append(`text`).attr(`x`,s).attr(`y`,c+35).style(`text-anchor`,`end`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`x`),l.append(`text`).attr(`x`,-10).attr(`y`,-5).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`c`);let f=l.append(`text`).attr(`x`,4).attr(`y`,15).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),p=l.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),m=.3,h=new Float32Array(200).fill(0);h[100]=1;let g=0,_;function v(){let e=new Float32Array(200);for(let t=0;t<200;t++){let n=h[(t-1+200)%200],r=h[(t+1)%200];e[t]=Math.max(0,h[t]+m*.2*(n-2*h[t]+r))}h=e,g+=m}function y(){let e=Array.from(h).map((e,t)=>[t/199,e]),t=i().x(e=>u(e[0])).y(e=>d(e[1]));p.attr(`d`,t(e)),f.text(`D·∇²c  t=${g.toFixed(1)}`)}function b(){_=requestAnimationFrame(b);for(let e=0;e<4;e++)v();y(),g>500&&(h.fill(0),h[100]=1,g=0)}return y(),b(),()=>{cancelAnimationFrame(_),r(a).select(`#d3-sim`).remove()}}};export{a as default};