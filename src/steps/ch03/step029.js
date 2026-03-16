/**
 * Step 29: Boundary Conditions in 2D
 */
import * as d3 from 'd3'

export default {
  title: 'Boundary Conditions in 2D',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Boundary Conditions</h3>
<p>Periodic (torus), Dirichlet (fixed values), and Neumann (zero flux) all produce
different behavior at the domain edges. Most simulations use periodic for visual cleanliness.</p></div>`,

  code: `<div class="code-section"><h3>2D Boundary Conditions Code</h3>
<pre><code class="language-js">// Periodic BC (default — wraps like a torus)
function lap(f, r, c, W, H) {
  const t = ((r-1+H)%H)*W + c,  b = ((r+1)%H)*W + c
  const l = r*W + ((c-1+W)%W),  ri = r*W + ((c+1)%W)
  return f[t] + f[b] + f[l] + f[ri] - 4*f[r*W+c]
}

// Dirichlet BC — fix boundary to u=1, v=0 after each step
function applyDirichlet(u, v, W, H) {
  for (let c = 0; c < W; c++) {
    u[c] = 1; v[c] = 0              // top row
    u[(H-1)*W+c] = 1; v[(H-1)*W+c] = 0  // bottom row
  }
  for (let r = 0; r < H; r++) {
    u[r*W] = 1; v[r*W] = 0          // left col
    u[r*W+W-1] = 1; v[r*W+W-1] = 0  // right col
  }
}

// Neumann BC — zero flux (copy inner neighbour to boundary)
function applyNeumann(u, W, H) {
  for (let c = 0; c < W; c++) { u[c] = u[W+c]; u[(H-1)*W+c] = u[(H-2)*W+c] }
  for (let r = 0; r < H; r++) { u[r*W] = u[r*W+1]; u[r*W+W-1] = u[r*W+W-2] }
}
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%'
    div.innerHTML = '<pre style="border:none;background:none">Step 29: Boundary Conditions in 2D</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
