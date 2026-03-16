import{t as e}from"./linear-BCfk2I7B.js";import{o as t}from"./src-51qo7f6l.js";import{t as n}from"./line-XuMgxOSY.js";var r={title:`1D Init: Seed Strategies`,chapter:2,math:`
<div class="math-section">
  <h3>Initial Conditions</h3>
  <p>The eventual pattern depends only weakly on initial conditions
  (Turing patterns are attractors). However, the <em>transient</em> dynamics
  and pattern nucleation do depend on the seed.</p>
</div>
<div class="math-section">
  <h3>Common Seed Strategies</h3>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Center square:</strong> V=1, U=0 in a small central region</li>
    <li><strong>Random noise:</strong> small random V perturbations everywhere</li>
    <li><strong>Stripes of V:</strong> tests whether stripes or spots are preferred</li>
    <li><strong>Single point:</strong> minimal perturbation from homogeneous state</li>
  </ul>
</div>
<div class="math-section">
  <h3>Noise for Symmetry Breaking</h3>
  <p>For a truly uniform seed, the system would never leave U=1, V=0
  (it's a fixed point). A tiny perturbation breaks the symmetry
  and allows Turing instability to develop.</p>
  <div class="math-block">$$U(x,0) = 1 - \\epsilon(x), \\quad V(x,0) = \\epsilon(x)$$</div>
  <p>where ε(x) is small random noise in [0, 0.01].</p>
</div>
`,code:`
<div class="code-section">
  <h3>Seed Strategies</h3>
<pre><code class="language-js">// Strategy 1: center patch
function seedCenter(u, v, N, halfW = 5) {
  u.fill(1.0); v.fill(0.0)
  const mid = Math.floor(N / 2)
  for (let i = mid - halfW; i <= mid + halfW; i++) {
    u[i] = 0.0
    v[i] = 1.0
  }
}

// Strategy 2: random noise
function seedRandom(u, v, N, density = 0.02) {
  u.fill(1.0); v.fill(0.0)
  for (let i = 0; i < N; i++) {
    if (Math.random() < density) {
      u[i] = 0.5 + Math.random() * 0.5
      v[i] = Math.random() * 0.5
    }
  }
}

// Strategy 3: checkerboard perturbation
function seedCheckerboard(u, v, N, amp = 0.1) {
  for (let i = 0; i < N; i++) {
    u[i] = 1.0 - amp * (i % 2)
    v[i] = amp * (i % 2)
  }
}
</code></pre>
</div>
`,init(r){let i={top:20,right:20,bottom:20,left:100},a=512-i.left-i.right,o=512-i.top-i.bottom,s=t(r).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${i.left},${i.top})`),c=[{label:`center patch`,gen:()=>{let e=new Float32Array(200).fill(1),t=new Float32Array(200).fill(0);for(let n=95;n<=105;n++)e[n]=0,t[n]=1;return{u:e,v:t}}},{label:`random noise`,gen:()=>{let e=new Float32Array(200).fill(1),t=new Float32Array(200).fill(0);for(let n=0;n<200;n++)Math.random()<.05&&(e[n]=.5,t[n]=.5);return{u:e,v:t}}},{label:`checkerboard`,gen:()=>{let e=new Float32Array(200),t=new Float32Array(200);for(let n=0;n<200;n++)e[n]=1-n%2*.1,t[n]=n%2*.1;return{u:e,v:t}}}],l=o/c.length,u=e().domain([0,1]).range([0,a]),d=e().domain([0,1]).range([l-20,0]),f=n().x(e=>u(e[0])).y(e=>d(e[1]));return c.forEach((e,t)=>{let{u:n,v:r}=e.gen(),i=s.append(`g`).attr(`transform`,`translate(0, ${t*l})`);i.append(`text`).attr(`x`,-90).attr(`y`,l/2+4).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,`#666`).text(e.label);let o=Array.from(n).map((e,t)=>[t/199,e]),u=Array.from(r).map((e,t)=>[t/199,e]);i.append(`path`).datum(o).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5).attr(`d`,f),i.append(`path`).datum(u).attr(`fill`,`none`).attr(`stroke`,`#aaa`).attr(`stroke-width`,1).attr(`d`,f),t<c.length-1&&i.append(`line`).attr(`x1`,0).attr(`x2`,a).attr(`y1`,l-4).attr(`y2`,l-4).attr(`stroke`,`#ddd`).attr(`stroke-width`,.5)}),s.append(`text`).attr(`x`,a-100).attr(`y`,10).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#000`).text(`U (black), V (gray)`),()=>{t(r).select(`#d3-sim`).remove()}}};export{r as default};