var e={title:`Diffusion: Fick's Law`,chapter:1,math:`
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
`,init(e){let t=document.createElement(`canvas`);t.width=512,t.height=512,t.id=`canvas2d-sim`,t.style.cssText=`display:block; width:512px; height:512px; margin:auto; margin-top:20px`,e.appendChild(t);let n=t.getContext(`2d`),r=.3,i=new Float32Array(200).fill(0);i[100]=1;let a=0,o;function s(){let e=new Float32Array(200);for(let t=0;t<200;t++){let n=i[(t-1+200)%200],a=i[(t+1)%200];e[t]=Math.max(0,i[t]+r*.2*(n-2*i[t]+a))}i=e,a+=r}function c(){n.clearRect(0,0,512,512),n.fillStyle=`#fff`,n.fillRect(0,0,512,512),n.strokeStyle=`#000`,n.lineWidth=1.5,n.beginPath();for(let e=0;e<200;e++){let t=24+e/199*464,r=488-i[e]*464;e===0?n.moveTo(t,r):n.lineTo(t,r)}n.stroke(),n.strokeStyle=`#000`,n.lineWidth=.5,n.beginPath(),n.moveTo(24,488),n.lineTo(488,488),n.moveTo(24,24),n.lineTo(24,488),n.stroke(),n.fillStyle=`#666`,n.font=`9pt SF Mono, monospace`,n.fillText(`D·∇²c  t=${a.toFixed(1)}`,28,36),n.fillText(`x`,488,484),n.fillText(`c`,28,24)}function l(){o=requestAnimationFrame(l);for(let e=0;e<4;e++)s();c(),a>500&&(i.fill(0),i[100]=1,a=0)}return l(),()=>{cancelAnimationFrame(o),e.innerHTML=``}}};export{e as default};