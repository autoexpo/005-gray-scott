/**
 * Step 3: Diffusion alone — Fick's Law and the heat equation.
 * Animated 1D heat equation demo.
 */
import * as d3 from 'd3'

export default {
  title: "Diffusion: Fick's Law",
  chapter: 1,

  math: `
<div class="math-section">
  <h3>Fick's Second Law of Diffusion</h3>
  <p>Diffusion describes the spreading of a quantity from regions of high concentration
  to regions of low concentration. In 1D:</p>
  <div class="math-block">$$\\frac{\\partial c}{\\partial t} = D \\frac{\\partial^2 c}{\\partial x^2}$$</div>
  <p>In 2D (and higher), the second derivative generalizes to the Laplacian:</p>
  <div class="math-block">$$\\frac{\\partial c}{\\partial t} = D \\nabla^2 c = D \\left(\\frac{\\partial^2 c}{\\partial x^2} + \\frac{\\partial^2 c}{\\partial y^2}\\right)$$</div>
</div>

<div class="math-section">
  <h3>Physical Intuition</h3>
  <p>The Laplacian $\\nabla^2 c$ measures the <em>deviation</em> of the local value from
  the spatial average of its neighbours:</p>
  <div class="math-block">$$\\nabla^2 c \\approx \\frac{\\bar{c}_{\\text{neighbours}} - c_{\\text{local}}}{h^2/4}$$</div>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>If $c_{\\text{local}} > \\bar{c}$: ∇²c < 0 → concentration decreases (flows out)</li>
    <li>If $c_{\\text{local}} < \\bar{c}$: ∇²c > 0 → concentration increases (flows in)</li>
    <li>If $c_{\\text{local}} = \\bar{c}$: ∇²c = 0 → no change</li>
  </ul>
</div>

<div class="math-section">
  <h3>Analytical Solution (1D Gaussian)</h3>
  <p>Starting from a Dirac delta $c(x,0) = \\delta(x)$, the solution is a Gaussian
  that spreads over time:</p>
  <div class="math-block">$$c(x,t) = \\frac{1}{\\sqrt{4\\pi D t}} \\exp\\!\\left(-\\frac{x^2}{4Dt}\\right)$$</div>
  <p>Width grows as $\\sigma = \\sqrt{2Dt}$ — the characteristic diffusion length.</p>
</div>

<div class="math-section">
  <h3>CFL Stability Condition</h3>
  <p>For stable explicit (Euler) integration in 1D with grid spacing h:</p>
  <div class="math-block">$$\\Delta t \\leq \\frac{h^2}{2D}$$</div>
  <p>In 2D: $\\Delta t \\leq \\frac{h^2}{4D}$. With h=1, D=0.2097: dt ≤ 2.38 (1D), dt ≤ 1.19 (2D).</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>1D Diffusion: Euler Step</h3>
  <div class="filename">1D heat equation demo</div>
<pre><code class="language-js">const N = 200     // grid points
const D = 0.2     // diffusion coefficient
const dt = 0.4    // time step (< h²/2D = 2.5)
const dx = 1.0    // grid spacing

// Initialize: spike at center
const c = new Float32Array(N).fill(0)
c[Math.floor(N/2)] = 1.0

function diffuseStep(c) {
  const next = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    // 1D finite-difference Laplacian:
    // ∂²c/∂x² ≈ (c[i-1] - 2c[i] + c[i+1]) / dx²
    const left  = c[(i - 1 + N) % N]  // periodic BC
    const right = c[(i + 1) % N]
    const lap = (left - 2 * c[i] + right) / (dx * dx)
    next[i] = c[i] + dt * D * lap
  }
  return next
}

// Animate
let current = c
function animate() {
  for (let s = 0; s < 3; s++)
    current = diffuseStep(current)
  draw(current)   // update canvas
  requestAnimationFrame(animate)
}
</code></pre>
</div>

<div class="code-section">
  <h3>Note: Laplacian = local deviation</h3>
<pre><code class="language-js">// The 1D Laplacian at index i:
//   lap = c[i-1] - 2*c[i] + c[i+1]
//       = (c[i-1] + c[i+1])/2 - c[i]
//           ↑ neighbour average      ↑ local value
//       = deviation from local mean

// If the cell is higher than its neighbours:
//   lap < 0  →  the cell loses concentration
// If lower than neighbours:
//   lap > 0  →  the cell gains concentration
// Result: concentration spreads until uniform.
</code></pre>
</div>
`,

  init(container) {
    const S = 512
    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 1]).range([0, W])
    const y = d3.scaleLinear().domain([0, 1]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(5))

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', '#000')
    g.selectAll('.tick text').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666')

    // Labels
    g.append('text').attr('x', W).attr('y', H + 35).style('text-anchor', 'end').style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').text('x')
    g.append('text').attr('x', -10).attr('y', -5).style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').text('c')

    // Time label
    const timeLabel = g.append('text').attr('x', 4).attr('y', 15).style('font-family', 'SF Mono, Menlo, monospace').style('font-size', '9pt').attr('fill', '#666')

    // Create path element for the line
    const path = g.append('path').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1.5)

    const N = 200
    const D = 0.2
    const dt = 0.3
    let c = new Float32Array(N).fill(0)
    c[Math.floor(N/2)] = 1.0
    let t = 0
    let animId

    function step() {
      const next = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        const l = c[(i-1+N)%N], r = c[(i+1)%N]
        next[i] = Math.max(0, c[i] + dt * D * (l - 2*c[i] + r))
      }
      c = next
      t += dt
    }

    function render() {
      const data = Array.from(c).map((v, i) => [i / (N-1), v])
      const line = d3.line().x(d => x(d[0])).y(d => y(d[1]))
      path.attr('d', line(data))
      timeLabel.text(`D·∇²c  t=${t.toFixed(1)}`)
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      for (let i = 0; i < 4; i++) step()
      render()
      // Reset when fully spread
      if (t > 500) {
        c.fill(0); c[Math.floor(N/2)] = 1.0; t = 0
      }
    }

    // Initial render and then start animation
    render()
    animate()

    return () => {
      cancelAnimationFrame(animId)
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
