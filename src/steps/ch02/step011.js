/**
 * Step 11: 1D finite-difference Laplacian.
 */
export default {
  title: '1D Finite-Difference Laplacian',
  chapter: 2,

  math: `
<div class="math-section">
  <h3>1D Finite Difference Approximation</h3>
  <p>The second derivative in 1D is approximated using three adjacent cells:</p>
  <div class="math-block">$$\\frac{\\partial^2 u}{\\partial x^2} \\approx \\frac{u_{i-1} - 2u_i + u_{i+1}}{h^2}$$</div>
  <p>With h=1 (unit grid spacing):</p>
  <div class="math-block">$$\\nabla^2 u_i = u_{i-1} - 2u_i + u_{i+1}$$</div>
</div>
<div class="math-section">
  <h3>Derivation via Taylor Series</h3>
  <p>Expanding u around point i:</p>
  <div class="math-block">$$u_{i+1} = u_i + h u' + \\frac{h^2}{2}u'' + \\frac{h^3}{6}u''' + O(h^4)$$</div>
  <div class="math-block">$$u_{i-1} = u_i - h u' + \\frac{h^2}{2}u'' - \\frac{h^3}{6}u''' + O(h^4)$$</div>
  <p>Adding: $u_{i+1} + u_{i-1} = 2u_i + h^2 u'' + O(h^4)$</p>
  <div class="math-block">$$u'' \\approx \\frac{u_{i+1} - 2u_i + u_{i-1}}{h^2} + O(h^2)$$</div>
  <p>The error is second-order in h: halving grid spacing → 4× more accurate.</p>
</div>
<div class="math-section">
  <h3>Boundary Conditions</h3>
  <p>At the grid edges (i=0 and i=N-1) we need values outside the grid.
  Periodic BCs: the grid wraps — edge cells are neighbours of each other.</p>
  <div class="math-block">$$u_{-1} \\equiv u_{N-1}, \\quad u_N \\equiv u_0$$</div>
</div>
`,

  code: `
<div class="code-section">
  <h3>1D Laplacian Implementation</h3>
<pre><code class="language-js">function laplacian1D(arr, i, N) {
  // Periodic boundary conditions via modulo
  const left  = arr[(i - 1 + N) % N]
  const right = arr[(i + 1) % N]
  const center = arr[i]

  // u_left - 2*u_center + u_right
  return left - 2 * center + right
}

// Compute for entire grid in one pass
function computeLaplacian(arr, out, N) {
  for (let i = 0; i < N; i++) {
    out[i] = laplacian1D(arr, i, N)
  }
}

// Usage in Gray-Scott step:
const lapU = new Float32Array(N)
const lapV = new Float32Array(N)
computeLaplacian(u, lapU, N)
computeLaplacian(v, lapV, N)

// Then:
// du/dt = Du * lapU - u*v*v + f*(1-u)
// dv/dt = Dv * lapV + u*v*v - (f+k)*v
</code></pre>
</div>
`,

  init(container) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:9pt; overflow-y:auto; height:100%'
    div.innerHTML = `
<pre style="border:none; background:none; line-height:1.8">
  1D FINITE DIFFERENCE LAPLACIAN
  ═══════════════════════════════

  Stencil: [ 1  −2  1 ]

  For cell i in array of N cells:

  ∇²u[i] = u[i-1] - 2·u[i] + u[i+1]

  Boundary conditions:
  ─────────────────────
  Periodic:  i-1 wraps to N-1
             i+1 wraps to 0

  Code:
  const L = (i-1+N)%N   // left neighbor
  const R = (i+1)%N     // right neighbor
  const lap = u[L] - 2*u[i] + u[R]

  Physical meaning:
  ─────────────────────
  lap > 0 → cell is BELOW neighbour avg
            → diffusion adds concentration

  lap < 0 → cell is ABOVE neighbour avg
            → diffusion removes concentration

  lap = 0 → cell equals neighbour avg
            → no diffusion flux

  Example:
  ─────────────────────
  [0.8, 0.8, 1.0, 0.8, 0.8]
  at center (i=2): lap = 0.8 - 2×1.0 + 0.8 = -0.4
  → center loses to neighbors (spreads out)

  [0.2, 0.2, 0.0, 0.2, 0.2]
  at center (i=2): lap = 0.2 - 2×0.0 + 0.2 = +0.4
  → center gains from neighbors (fills in)
</pre>`
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
