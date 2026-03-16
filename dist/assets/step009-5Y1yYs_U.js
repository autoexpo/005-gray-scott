import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";var a={title:`1D Grid: Typed Arrays`,chapter:2,math:`
<div class="math-section">
  <h3>Discretizing the 1D Domain</h3>
  <p>To simulate the PDE numerically, we replace the continuous spatial domain
  with a discrete grid of N cells. Each cell stores a scalar concentration value.</p>
  <div class="math-block">$$x_i = i \\cdot h, \\quad i = 0, 1, \\ldots, N-1$$</div>
  <p>With grid spacing h=1 (common convention for Gray-Scott).</p>
</div>

<div class="math-section">
  <h3>Why Float32Array?</h3>
  <p>JavaScript typed arrays offer significant performance advantages over
  regular arrays for numerical computation:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>Fixed element type → no type coercion overhead</li>
    <li>Contiguous memory → better cache performance</li>
    <li>Can be passed directly to WebGL as texture data</li>
    <li>Float32 is sufficient precision (7 decimal digits)</li>
  </ul>
</div>

<div class="math-section">
  <h3>Memory Layout</h3>
  <p>For a 1D grid of N cells, we maintain two buffers:</p>
  <div class="math-block">$$\\text{u[0..N-1]}, \\quad \\text{v[0..N-1]}$$</div>
  <p>And two "back buffers" for double-buffering:</p>
  <div class="math-block">$$\\text{u2[0..N-1]}, \\quad \\text{v2[0..N-1]}$$</div>
  <p>After each step, front and back are swapped.</p>
</div>

<div class="math-section">
  <h3>Initialization</h3>
  <p>Standard initial conditions for Gray-Scott:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>U = 1 everywhere (full food)</li>
    <li>V = 0 everywhere (no activator)</li>
    <li>Then seed a small region with V = 1, U = 0</li>
  </ul>
</div>
`,code:`
<div class="code-section">
  <h3>1D Grid Initialization</h3>
  <div class="filename">src/cpu/Grid.js</div>
<pre><code class="language-js">class Grid1D {
  constructor(N) {
    this.N = N
    // Front buffers (current state)
    this.u = new Float32Array(N)
    this.v = new Float32Array(N)
    // Back buffers (next state, avoid aliasing)
    this.u2 = new Float32Array(N)
    this.v2 = new Float32Array(N)
  }

  /** Initialize u=1, v=0 everywhere, seed center */
  init(seedHalfWidth = 5) {
    this.u.fill(1.0)
    this.v.fill(0.0)
    const mid = Math.floor(this.N / 2)
    for (let i = mid - seedHalfWidth;
             i <= mid + seedHalfWidth; i++) {
      this.u[i] = 0.0
      this.v[i] = 1.0
    }
  }

  /** Swap front/back buffers */
  swap() {
    [this.u, this.u2] = [this.u2, this.u]
    [this.v, this.v2] = [this.v2, this.v]
  }

  /** Periodic index wrap */
  idx(i) {
    return ((i % this.N) + this.N) % this.N
  }
}
</code></pre>
</div>

<div class="code-section">
  <h3>Memory: 4 × N × 4 bytes</h3>
<pre><code class="language-js">// For N=256 cells:
// 4 arrays × 256 floats × 4 bytes = 4096 bytes = 4 KB

// For a 256×256 2D grid:
// 4 arrays × 65536 floats × 4 bytes = 1 MB

// For a 1024×1024 2D grid:
// 4 arrays × 1048576 floats × 4 bytes = 16 MB

// The GPU stores the same in just 2 textures
// (using RG channels for u and v):
// 2 textures × 1024² × 2 floats × 4 bytes = 8 MB (WebGL2)
</code></pre>
</div>
`,init(a){let o={top:20,right:20,bottom:60,left:50},s=512-o.left-o.right,c=512-o.top-o.bottom,l=r(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=e().domain([0,1]).range([0,s]),d=e().domain([0,1]).range([c,0]);l.append(`g`).attr(`transform`,`translate(0,${c})`).call(n(u).ticks(5)),l.append(`g`).call(t(d).ticks(5)),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`);let f=new Float32Array(200).fill(1),p=new Float32Array(200).fill(0);for(let e=95;e<=105;e++)f[e]=0,p[e]=1;let m=i().x(e=>u(e[0])).y(e=>d(e[1])),h=Array.from(f).map((e,t)=>[t/199,e]),g=Array.from(p).map((e,t)=>[t/199,e]);l.append(`path`).datum(h).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5).attr(`d`,m),l.append(`path`).datum(g).attr(`fill`,`none`).attr(`stroke`,`#888`).attr(`stroke-width`,1.5).attr(`stroke-dasharray`,`3,3`).attr(`d`,m);let _=l.append(`g`).attr(`transform`,`translate(10, 10)`);return _.append(`line`).attr(`x1`,0).attr(`x2`,15).attr(`y1`,0).attr(`y2`,0).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),_.append(`text`).attr(`x`,20).attr(`y`,4).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).text(`U=1`),_.append(`line`).attr(`x1`,0).attr(`x2`,15).attr(`y1`,12).attr(`y2`,12).attr(`stroke`,`#888`).attr(`stroke-width`,1.5).attr(`stroke-dasharray`,`3,3`),_.append(`text`).attr(`x`,20).attr(`y`,16).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).text(`V=0 (seeded at center)`),l.append(`text`).attr(`x`,0).attr(`y`,c+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#000`).text(`Initial conditions: U=1 (black), V=0 (gray), V-seed at center`),()=>{r(a).select(`#d3-sim`).remove()}}};export{a as default};