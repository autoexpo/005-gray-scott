import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`Reaction: Autocatalysis`,chapter:1,math:`
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
`,code:`
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
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=[{f:.055,k:.062,label:`f=0.055 k=0.062 (spots)`},{f:.028,k:.053,label:`f=0.028 k=0.053 (mitosis)`},{f:.035,k:.065,label:`f=0.035 k=0.065 (stable)`}].map(e=>{let t=1,n=.05,r=[];for(let i=0;i<3e3;i++){let a=t*n*n,o=-a+e.f*(1-t),s=a-(e.f+e.k)*n;t=Math.max(0,Math.min(1,t+o)),n=Math.max(0,Math.min(1,n+s)),i%5==0&&r.push({u:t,v:n})}return{pts:r,label:e.label}});function o(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=e-60,o=t-60-30;i.strokeStyle=`#000`,i.lineWidth=.5,i.beginPath(),i.moveTo(30,30),i.lineTo(30,t-30-30),i.moveTo(30,t-30-30),i.lineTo(e-30,t-30-30),i.stroke(),i.fillStyle=`#888`,i.font=`9pt SF Mono, monospace`,i.fillText(`U (food)`,e/2-20,t-10),i.fillText(`V (activator)`,2,t/2),i.fillText(`Phase plane: reaction only (no diffusion)`,30,24),a.forEach((e,n)=>{i.strokeStyle=[`#000`,`#555`,`#999`][n],i.lineWidth=1,i.beginPath(),e.pts.forEach((e,n)=>{let a=30+e.u*r,s=t-30-30-e.v*o;n===0?i.moveTo(a,s):i.lineTo(a,s)}),i.stroke();let a=e.pts[e.pts.length-1];i.fillStyle=`#555`,i.font=`8pt monospace`,i.fillText(`•`,30+a.u*r,t-30-30-a.v*o)}),a.forEach((e,t)=>{let n=46+t*14;i.fillStyle=[`#000`,`#555`,`#999`][t],i.font=`8pt monospace`,i.fillText(e.label,34,n)})}return requestAnimationFrame(o),()=>{cancelAnimationFrame(void 0),r(),t.innerHTML=``}}};export{t as default};