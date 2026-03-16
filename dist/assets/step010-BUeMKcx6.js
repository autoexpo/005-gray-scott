import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`1D Init: Seed Strategies`,chapter:2,math:`
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
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=[{label:`center patch`,gen:()=>{let e=new Float32Array(200).fill(1),t=new Float32Array(200).fill(0);for(let n=95;n<=105;n++)e[n]=0,t[n]=1;return{u:e,v:t}}},{label:`random noise`,gen:()=>{let e=new Float32Array(200).fill(1),t=new Float32Array(200).fill(0);for(let n=0;n<200;n++)Math.random()<.05&&(e[n]=.5,t[n]=.5);return{u:e,v:t}}},{label:`checkerboard`,gen:()=>{let e=new Float32Array(200),t=new Float32Array(200);for(let n=0;n<200;n++)e[n]=1-n%2*.1,t[n]=n%2*.1;return{u:e,v:t}}}];function o(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=(t-16)/a.length;a.forEach((t,n)=>{let{u:a,v:o}=t.gen(),s=8+n*r,c=r-20;i.fillStyle=`#666`,i.font=`8pt monospace`,i.fillText(t.label,4,s+c/2+4),i.strokeStyle=`#000`,i.lineWidth=1.5,i.beginPath();for(let t=0;t<200;t++){let n=80+t/199*(e-80-8),r=s+c-a[t]*c;t?i.lineTo(n,r):i.moveTo(n,r)}i.stroke(),i.strokeStyle=`#aaa`,i.lineWidth=1,i.beginPath();for(let t=0;t<200;t++){let n=80+t/199*(e-80-8),r=s+c-o[t]*c;t?i.lineTo(n,r):i.moveTo(n,r)}i.stroke(),i.strokeStyle=`#ddd`,i.lineWidth=.5,i.beginPath(),i.moveTo(80,s+r-4),i.lineTo(e-8,s+r-4),i.stroke()}),i.fillStyle=`#000`,i.font=`9pt SF Mono, monospace`,i.fillText(`U (black), V (gray)`,e-100,10)}return requestAnimationFrame(o),()=>{r(),t.innerHTML=``}}};export{t as default};