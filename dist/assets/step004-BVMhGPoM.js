import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`The Laplacian Operator`,chapter:1,math:`
<div class="math-section">
  <h3>The Laplacian in 2D</h3>
  <p>The Laplacian of a scalar field u at point (x,y):</p>
  <div class="math-block">$$\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2}$$</div>
  <p>On a regular 2D grid with spacing h=1, we approximate both partial
  second derivatives using finite differences:</p>
</div>

<div class="math-section">
  <h3>5-Point Finite Difference Stencil</h3>
  <div class="math-block">$$\\nabla^2 u_{i,j} \\approx u_{i-1,j} + u_{i+1,j} + u_{i,j-1} + u_{i,j+1} - 4u_{i,j}$$</div>
  <p>Visually, this is the "plus" stencil:</p>
<pre style="border:none; background:none; text-align:center; font-size:11pt; line-height:1.8; margin:8px 0">
        +1
    +1  −4  +1
        +1
</pre>
  <p>The second-order truncation error is $O(h^2)$: halving the grid spacing
  reduces the error by a factor of 4.</p>
</div>

<div class="math-section">
  <h3>Why "Deviation from Average"</h3>
  <p>Rewrite the stencil:</p>
  <div class="math-block">$$\\nabla^2 u_{i,j} = \\left(\\frac{u_{i-1,j}+u_{i+1,j}+u_{i,j-1}+u_{i,j+1}}{4}\\right) - u_{i,j} \\times 4$$</div>
  <p>Wait — actually:</p>
  <div class="math-block">$$= 4\\left(\\underbrace{\\bar{u}_{\\text{cardinal}}}_{\\text{mean of 4 neighbours}} - u_{i,j}\\right)$$</div>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>∇²u > 0: cell is a <strong>local minimum</strong> → gains</li>
    <li>∇²u < 0: cell is a <strong>local maximum</strong> → loses</li>
    <li>∇²u = 0: cell equals neighbour mean → steady</li>
  </ul>
</div>

<div class="math-section">
  <h3>Error and Isotropy</h3>
  <p>The 5-point stencil has a directional bias: it treats the x and y axes
  identically but ignores diagonals. This produces slightly diamond-shaped
  diffusion at coarse resolutions. The 9-point stencil (Step 27) corrects this.</p>
</div>
`,code:`
<div class="code-section">
  <h3>5-Point Laplacian in JavaScript</h3>
  <div class="filename">src/cpu/Laplacian.js</div>
<pre><code class="language-js">/**
 * 5-point Laplacian for cell (r, c).
 * Uses periodic boundary conditions via grid.idx().
 *
 * @param {Float32Array} arr - concentration field
 * @param {Grid} grid       - provides idx(r,c) with wrap
 * @param {number} r        - row
 * @param {number} c        - column
 * @returns {number}        - Laplacian value
 */
function lap5(arr, grid, r, c) {
  return arr[grid.idx(r - 1, c)]  // north
       + arr[grid.idx(r + 1, c)]  // south
       + arr[grid.idx(r, c - 1)]  // west
       + arr[grid.idx(r, c + 1)]  // east
       - 4.0 * arr[grid.idx(r, c)] // centre ×−4
}

// Periodic wrap: handles edges transparently
function idx(r, c) {
  const row = ((r % H) + H) % H
  const col = ((c % W) + W) % W
  return row * W + col
}
</code></pre>
</div>

<div class="code-section">
  <h3>GLSL equivalent (GPU)</h3>
<pre><code class="language-glsl">// In the simulation fragment shader:
// uTexelSize = vec2(1/width, 1/height)
// vUv = current texel UV coordinate

float u = texture2D(uState, vUv).r;

float lapU =
  texture2D(uState, vUv + vec2( ts.x,  0.0)).r
+ texture2D(uState, vUv + vec2(-ts.x,  0.0)).r
+ texture2D(uState, vUv + vec2( 0.0,  ts.y)).r
+ texture2D(uState, vUv + vec2( 0.0, -ts.y)).r
- 4.0 * u;

// Texture wrap mode = RepeatWrapping
// → automatic periodic boundary conditions
</code></pre>
</div>
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=new Float32Array(81);for(let e=0;e<9;e++)for(let t=0;t<9;t++){let n=e-4,r=t-4;a[e*9+t]=Math.exp(-(n*n+r*r)/4)*.8}let o=4,s=4;function c(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=(e-40)/9,c=(t-40-40)/9;for(let e=0;e<9;e++)for(let t=0;t<9;t++){let n=a[e*9+t],l=Math.round((1-n)*255),u=20+t*r,d=20+e*c;i.fillStyle=`rgb(${l},${l},${l})`,i.fillRect(u,d,r-1,c-1);let f=e-o,p=t-s,m=f===0&&p===0,h=Math.abs(f)+Math.abs(p)===1;m?(i.strokeStyle=`#000`,i.lineWidth=2,i.strokeRect(u,d,r-1,c-1),i.fillStyle=`#000`,i.font=`8pt monospace`,i.fillText(`−4`,u+2,d+c-4)):h&&(i.strokeStyle=`#000`,i.lineWidth=1.5,i.strokeRect(u,d,r-1,c-1),i.fillStyle=`#000`,i.font=`8pt monospace`,i.fillText(`+1`,u+2,d+c-4))}let l=o*9+s,u=(e,t)=>{let n=(e%9+9)%9,r=(t%9+9)%9;return n*9+r},d=a[u(o-1,s)]+a[u(o+1,s)]+a[u(o,s-1)]+a[u(o,s+1)]-4*a[l];i.fillStyle=`#000`,i.font=`9pt SF Mono, monospace`,i.fillText(`cell (${o},${s}):  u=${a[l].toFixed(3)}  ∇²u=${d.toFixed(3)}`,20,t-10)}return n.addEventListener(`mousemove`,e=>{let t=n.getBoundingClientRect(),r=(n.width-40)/9,i=(n.height-40-40)/9,a=Math.floor((e.clientX-t.left-20)/r),l=Math.floor((e.clientY-t.top-20)/i);l>=0&&l<9&&a>=0&&a<9&&(o=l,s=a,c())}),requestAnimationFrame(c),()=>{r(),t.innerHTML=``}}};export{t as default};