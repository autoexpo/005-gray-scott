import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`1D Grid: Typed Arrays`,chapter:2,math:`
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
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=new Float32Array(200).fill(1),o=new Float32Array(200).fill(0);for(let e=95;e<=105;e++)a[e]=0,o[e]=1;function s(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=e-48,s=t-48-30;i.strokeStyle=`#000`,i.lineWidth=1.5,i.beginPath();for(let e=0;e<200;e++){let t=24+e/199*r,n=24+s-a[e]*s;e?i.lineTo(t,n):i.moveTo(t,n)}i.stroke(),i.strokeStyle=`#888`,i.lineWidth=1.5,i.beginPath();for(let e=0;e<200;e++){let t=24+e/199*r,n=24+s-o[e]*s;e?i.lineTo(t,n):i.moveTo(t,n)}i.stroke(),i.strokeStyle=`#000`,i.lineWidth=.5,i.beginPath(),i.moveTo(24,24+s),i.lineTo(e-24,24+s),i.moveTo(24,24),i.lineTo(24,24+s),i.stroke(),i.fillStyle=`#000`,i.font=`9pt SF Mono, monospace`,i.fillText(`Initial conditions: U=1 (black), V=0 (gray), V-seed at center`,24,t-8),i.fillText(`u=1`,e-24-20,24+s-4)}return requestAnimationFrame(s),()=>{r(),t.innerHTML=``}}};export{t as default};