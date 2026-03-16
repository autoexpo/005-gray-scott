import{o as e}from"./src-51qo7f6l.js";function t(e){let t;for(;t=e.sourceEvent;)e=t;return e}function n(e,n){if(e=t(e),n===void 0&&(n=e.currentTarget),n){var r=n.ownerSVGElement||n;if(r.createSVGPoint){var i=r.createSVGPoint();return i.x=e.clientX,i.y=e.clientY,i=i.matrixTransform(n.getScreenCTM().inverse()),[i.x,i.y]}if(n.getBoundingClientRect){var a=n.getBoundingClientRect();return[e.clientX-a.left-n.clientLeft,e.clientY-a.top-n.clientTop]}}return[e.pageX,e.pageY]}var r={title:`The Laplacian Operator`,chapter:1,math:`
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
`,init(t){let r={top:20,right:20,bottom:60,left:20},i=512-r.left-r.right,a=512-r.top-r.bottom,o=e(t).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`),s=o.append(`g`).attr(`transform`,`translate(${r.left},${r.top})`),c=new Float32Array(81);for(let e=0;e<9;e++)for(let t=0;t<9;t++){let n=e-4,r=t-4;c[e*9+t]=Math.exp(-(n*n+r*r)/4)*.8}let l=4,u=4,d=i/9,f=a/9,p=s.append(`text`).attr(`x`,0).attr(`y`,a+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#000`);function m(){s.selectAll(`rect`).remove(),s.selectAll(`.cell-text`).remove();for(let e=0;e<9;e++)for(let t=0;t<9;t++){let n=c[e*9+t],r=Math.round((1-n)*255),i=t*d,a=e*f;s.append(`rect`).attr(`x`,i).attr(`y`,a).attr(`width`,d-1).attr(`height`,f-1).attr(`fill`,`rgb(${r},${r},${r})`);let o=e-l,p=t-u,m=o===0&&p===0,h=Math.abs(o)+Math.abs(p)===1;m?(s.append(`rect`).attr(`x`,i).attr(`y`,a).attr(`width`,d-1).attr(`height`,f-1).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,2),s.append(`text`).attr(`class`,`cell-text`).attr(`x`,i+2).attr(`y`,a+f-4).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,`#000`).text(`−4`)):h&&(s.append(`rect`).attr(`x`,i).attr(`y`,a).attr(`width`,d-1).attr(`height`,f-1).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),s.append(`text`).attr(`class`,`cell-text`).attr(`x`,i+2).attr(`y`,a+f-4).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,`#000`).text(`+1`))}let e=l*9+u,t=(e,t)=>{let n=(e%9+9)%9,r=(t%9+9)%9;return n*9+r},n=c[t(l-1,u)]+c[t(l+1,u)]+c[t(l,u-1)]+c[t(l,u+1)]-4*c[e];p.text(`cell (${l},${u}):  u=${c[e].toFixed(3)}  ∇²u=${n.toFixed(3)}`)}return o.on(`mousemove`,function(e){let[t,r]=n(e,s.node()),i=Math.floor(t/d),a=Math.floor(r/f);a>=0&&a<9&&i>=0&&i<9&&(l=a,u=i,m())}),m(),()=>{e(t).select(`#d3-sim`).remove()}}};export{r as default};