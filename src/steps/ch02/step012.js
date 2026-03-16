/**
 * Step 12: Euler integration in 1D — the full step function.
 */
import * as d3 from 'd3'

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
    const S = 512
    const margin = { top: 20, right: 20, bottom: 60, left: 50 }
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

    // Create path elements for U and V lines
    const uPath = g.append('path').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1.5)
    const vPath = g.append('path').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 1)

    // Time and parameter label
    const infoLabel = g.append('text')
      .attr('x', 0).attr('y', H + 50)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '9pt')
      .attr('fill', '#666')

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

    function render() {
      const uData = Array.from(u).map((val, i) => [i / (N-1), val])
      const vData = Array.from(v).map((val, i) => [i / (N-1), val])

      uPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(uData))
      vPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(vData))

      infoLabel.text(`t=${t}  U (black)  V (gray)`)
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      for(let i=0;i<4;i++) step()
      render()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
