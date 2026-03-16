import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";var a={title:`Reaction: Autocatalysis`,chapter:1,math:`
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
`,init(a){let o={top:60,right:20,bottom:50,left:60},s=512-o.left-o.right,c=512-o.top-o.bottom,l=r(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=e().domain([0,1]).range([0,s]),d=e().domain([0,.5]).range([c,0]);l.append(`g`).attr(`transform`,`translate(0,${c})`).call(n(u).ticks(5)),l.append(`g`).call(t(d).ticks(5)),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),l.append(`text`).attr(`x`,s/2).attr(`y`,c+40).style(`text-anchor`,`middle`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`U (food)`),l.append(`text`).attr(`x`,-40).attr(`y`,c/2).style(`text-anchor`,`middle`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`transform`,`rotate(-90, -40, ${c/2})`).text(`V (activator)`),l.append(`text`).attr(`x`,0).attr(`y`,-10).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`).text(`Phase plane: reaction only (no diffusion)`);let f=[{f:.055,k:.062,label:`f=0.055 k=0.062 (spots)`,color:`#000`},{f:.028,k:.053,label:`f=0.028 k=0.053 (mitosis)`,color:`#555`},{f:.035,k:.065,label:`f=0.035 k=0.065 (stable)`,color:`#999`}].map(e=>{let t=1,n=.05,r=[];for(let i=0;i<3e3;i++){let a=t*n*n,o=-a+e.f*(1-t),s=a-(e.f+e.k)*n;t=Math.max(0,Math.min(1,t+o)),n=Math.max(0,Math.min(1,n+s)),i%5==0&&r.push([t,n])}return{pts:r,label:e.label,color:e.color}});f.forEach((e,t)=>{let n=i().x(e=>u(e[0])).y(e=>d(e[1]));l.append(`path`).datum(e.pts).attr(`fill`,`none`).attr(`stroke`,e.color).attr(`stroke-width`,1.5).attr(`d`,n),l.append(`circle`).attr(`cx`,u(e.pts[0][0])).attr(`cy`,d(e.pts[0][1])).attr(`r`,3).attr(`fill`,`none`).attr(`stroke`,e.color).attr(`stroke-width`,1.5);let r=e.pts[e.pts.length-1];l.append(`circle`).attr(`cx`,u(r[0])).attr(`cy`,d(r[1])).attr(`r`,2).attr(`fill`,e.color)});let p=l.append(`g`).attr(`transform`,`translate(${s-200}, 20)`);return f.forEach((e,t)=>{let n=t*14;p.append(`rect`).attr(`x`,0).attr(`y`,n-8).attr(`width`,12).attr(`height`,2).attr(`fill`,e.color),p.append(`text`).attr(`x`,16).attr(`y`,n-3).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,e.color).text(e.label)}),()=>{r(a).select(`#d3-sim`).remove()}}};export{a as default};