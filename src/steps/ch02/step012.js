/**
 * Step 12: Euler integration in 1D — the full step function.
 */
import { makeCanvas2D } from '../../utils/canvas2d.js'

export default {
  title: '1D Euler Integration Step',
  chapter: 2,

  math: `
<div class="math-section">
  <h3>Forward Euler Method</h3>
  <p>The simplest explicit time-integration scheme:</p>
  <div class="math-block">$$u(t + \\Delta t) = u(t) + \\Delta t \\cdot \\frac{du}{dt}\\bigg|_t$$</div>
  <p>This is a first-order approximation: the derivative at time t
  is assumed constant over the interval Δt.</p>
</div>
<div class="math-section">
  <h3>Applied to Gray-Scott</h3>
  <p>For each cell i at each time step:</p>
  <div class="math-block">$$u_i^{t+1} = u_i^t + \\Delta t \\left(D_U \\nabla^2 u_i - u_i v_i^2 + f(1-u_i)\\right)$$</div>
  <div class="math-block">$$v_i^{t+1} = v_i^t + \\Delta t \\left(D_V \\nabla^2 v_i + u_i v_i^2 - (f+k)v_i\\right)$$</div>
  <p>Note: we must use values from time t (not t+1) for both equations.
  This is why we need front/back buffer double-buffering.</p>
</div>
<div class="math-section">
  <h3>Stability: CFL Condition</h3>
  <p>Euler is stable when the diffusion number satisfies:</p>
  <div class="math-block">$$r = \\frac{D \\Delta t}{h^2} \\leq \\frac{1}{2} \\quad (\\text{1D})$$</div>
  <p>With h=1, D=0.2097: Δt ≤ 2.38. We use Δt=1.0 for safety margin.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>1D Euler Step</h3>
  <div class="filename">src/cpu/Integrator.js</div>
<pre><code class="language-js">function eulerStep1D(grid, params) {
  const { f, k, Du, Dv, dt } = params
  const N = grid.N
  const u = grid.u, v = grid.v  // read from front
  const u2 = grid.u2, v2 = grid.v2  // write to back

  for (let i = 0; i < N; i++) {
    const ui = u[i], vi = v[i]

    // 1D Laplacian (periodic BCs)
    const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
    const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
    const lapU = ul - 2*ui + ur
    const lapV = vl - 2*vi + vr

    // Gray-Scott reaction
    const uvv = ui * vi * vi

    // Derivatives
    const du = Du*lapU - uvv + f*(1-ui)
    const dv = Dv*lapV + uvv - (f+k)*vi

    // Euler update (write to back buffer)
    u2[i] = Math.max(0, Math.min(1, ui + dt*du))
    v2[i] = Math.max(0, Math.min(1, vi + dt*dv))
  }

  // Swap: back becomes front
  grid.swap()
}
</code></pre>
</div>
`,

  init(container) {
    const { canvas, disconnect } = makeCanvas2D(container, false)
    const ctx = canvas.getContext('2d')
    const N = 200
    let u = new Float32Array(N).fill(1)
    let v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N)
    let v2 = new Float32Array(N)
    const m = Math.floor(N/2)
    for (let i=m-6;i<=m+6;i++){u[i]=0;v[i]=1}
    const p = { f:0.055,k:0.062,Du:0.2097,Dv:0.105,dt:1.0 }
    let t=0, animId

    function step() {
      for (let i=0;i<N;i++){
        const ul=u[(i-1+N)%N],ur=u[(i+1)%N]
        const vl=v[(i-1+N)%N],vr=v[(i+1)%N]
        const lapU=ul-2*u[i]+ur, lapV=vl-2*v[i]+vr
        const uvv=u[i]*v[i]*v[i]
        u2[i]=Math.max(0,Math.min(1,u[i]+p.dt*(p.Du*lapU-uvv+p.f*(1-u[i]))))
        v2[i]=Math.max(0,Math.min(1,v[i]+p.dt*(p.Dv*lapV+uvv-(p.f+p.k)*v[i])))
      }
      ;[u,u2]=[u2,u];[v,v2]=[v2,v]
      t++
    }

    function draw() {
      const W=canvas.width,H=canvas.height
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
      const pad=24,ph=H-pad*2-20
      ctx.strokeStyle='#000'; ctx.lineWidth=1.5
      ctx.beginPath()
      for(let i=0;i<N;i++){
        const x=pad+(i/(N-1))*(W-pad*2)
        const y=pad+ph-u[i]*ph
        i?ctx.lineTo(x,y):ctx.moveTo(x,y)
      }
      ctx.stroke()
      ctx.strokeStyle='#999'; ctx.lineWidth=1
      ctx.beginPath()
      for(let i=0;i<N;i++){
        const x=pad+(i/(N-1))*(W-pad*2)
        const y=pad+ph-v[i]*ph
        i?ctx.lineTo(x,y):ctx.moveTo(x,y)
      }
      ctx.stroke()
      ctx.fillStyle='#666'; ctx.font='9pt SF Mono,monospace'
      ctx.fillText(`t=${t}  U (black)  V (gray)`,pad,H-6)
    }

    function animate() {
      animId=requestAnimationFrame(animate)
      for(let i=0;i<4;i++) step()
      draw()
    }
    animate()
    return () => { cancelAnimationFrame(animId); disconnect(); container.innerHTML='' }
  }
}
