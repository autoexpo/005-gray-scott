/** Step 14: Visualizing 1D output — bar chart. */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'
export default {
  title: '1D Visualization: Line Chart',
  chapter: 2,
  math: `<div class="math-section"><h3>1D Visualization</h3>
<p>For 1D simulations, a line chart plots concentration vs. position.
U (food) and V (activator) are plotted simultaneously.</p>
<p>Note: the Gray-Scott model is <em>not</em> biologically realistic in 1D.
Interesting patterns (spots, stripes) require 2D. In 1D we see traveling waves and pulses.</p>
</div>`,
  code: `<div class="code-section"><h3>Canvas 2D Rendering</h3>
<pre><code class="language-js">function drawLine(ctx, arr, N, W, H, color) {
  ctx.strokeStyle = color
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = (i / (N-1)) * W
    const y = H - arr[i] * H
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()
}
</code></pre></div>`,
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
    const vPath = g.append('path').attr('fill', 'none').attr('stroke', '#888').attr('stroke-width', 1.5)

    // Time and parameter label
    const infoLabel = g.append('text')
      .attr('x', 0).attr('y', H + 50)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '9pt')
      .attr('fill', '#666')

    const N = 200
    let u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N), v2 = new Float32Array(N)
    const m = Math.floor(N/2)
    for (let i=m-6;i<=m+6;i++){u[i]=0;v[i]=1}
    const p = {f:0.055,k:0.062,Du:0.2097,Dv:0.105,dt:1.0}
    let t=0, animId, paused=false

    function reset() {
      u.fill(1); v.fill(0)
      for (let i=m-6;i<=m+6;i++){u[i]=0;v[i]=1}
      t=0
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function step() {
      for(let i=0;i<N;i++){
        const ul=u[(i-1+N)%N],ur=u[(i+1)%N],vl=v[(i-1+N)%N],vr=v[(i+1)%N]
        const lapU=ul-2*u[i]+ur,lapV=vl-2*v[i]+vr,uvv=u[i]*v[i]*v[i]
        u2[i]=Math.max(0,Math.min(1,u[i]+p.dt*(p.Du*lapU-uvv+p.f*(1-u[i]))))
        v2[i]=Math.max(0,Math.min(1,v[i]+p.dt*(p.Dv*lapV+uvv-(p.f+p.k)*v[i])))
      }
      ;[u,u2]=[u2,u];[v,v2]=[v2,v];t++
    }

    function render() {
      const uData = Array.from(u).map((val, i) => [i / (N-1), val])
      const vData = Array.from(v).map((val, i) => [i / (N-1), val])

      uPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(uData))
      vPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(vData))

      infoLabel.text(`t=${t}  U (black)  V (gray)  f=${p.f}  k=${p.k}`)
    }

    function animate(){
      animId=requestAnimationFrame(animate)
      if (!paused) for(let i=0;i<6;i++)step()
      render()
    }
    animate()

    return ()=>{
      cancelAnimationFrame(animId)
      controls.remove()
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
