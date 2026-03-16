/**
 * Step 10: Initializing U and V — seed, fill, boundary.
 */
import { makeCanvas2D } from '../../utils/canvas2d.js'

export default {
  title: '1D Init: Seed Strategies',
  chapter: 2,

  math: `
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
`,

  code: `
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
`,

  init(container) {
    const { canvas, disconnect } = makeCanvas2D(container, false)
    const ctx = canvas.getContext('2d')
    const N = 200

    const strategies = [
      { label: 'center patch', gen: () => {
        const u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
        const m = Math.floor(N/2)
        for (let i = m-5; i <= m+5; i++) { u[i]=0; v[i]=1 }
        return { u, v }
      }},
      { label: 'random noise', gen: () => {
        const u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
        for (let i = 0; i < N; i++) if (Math.random()<0.05) { u[i]=0.5; v[i]=0.5 }
        return { u, v }
      }},
      { label: 'checkerboard', gen: () => {
        const u = new Float32Array(N), v = new Float32Array(N)
        for (let i = 0; i < N; i++) { u[i]=1-0.1*(i%2); v[i]=0.1*(i%2) }
        return { u, v }
      }},
    ]

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='#fff'
      ctx.fillRect(0,0,W,H)

      const padY = 8, rowH = (H - padY*2) / strategies.length
      const padX = 80

      strategies.forEach((s, si) => {
        const { u, v } = s.gen()
        const y0 = padY + si * rowH
        const ph = rowH - 20

        ctx.fillStyle = '#666'
        ctx.font = '8pt monospace'
        ctx.fillText(s.label, 4, y0 + ph/2 + 4)

        // u
        ctx.strokeStyle='#000'
        ctx.lineWidth=1.5
        ctx.beginPath()
        for(let i=0;i<N;i++){
          const x=padX+(i/(N-1))*(W-padX-8)
          const y=y0+ph-u[i]*ph
          i?ctx.lineTo(x,y):ctx.moveTo(x,y)
        }
        ctx.stroke()

        // v
        ctx.strokeStyle='#aaa'
        ctx.lineWidth=1
        ctx.beginPath()
        for(let i=0;i<N;i++){
          const x=padX+(i/(N-1))*(W-padX-8)
          const y=y0+ph-v[i]*ph
          i?ctx.lineTo(x,y):ctx.moveTo(x,y)
        }
        ctx.stroke()

        ctx.strokeStyle='#ddd'
        ctx.lineWidth=0.5
        ctx.beginPath()
        ctx.moveTo(padX,y0+rowH-4); ctx.lineTo(W-8,y0+rowH-4)
        ctx.stroke()
      })

      ctx.fillStyle='#000'
      ctx.font='9pt SF Mono, monospace'
      ctx.fillText('U (black), V (gray)',W-100,10)
    }

    requestAnimationFrame(draw)
    return () => { disconnect(); container.innerHTML='' }
  }
}
