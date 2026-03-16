/** Step 14: Visualizing 1D output — bar chart. */
import { makeCanvas2D } from '../../utils/canvas2d.js'
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
    const { canvas, disconnect } = makeCanvas2D(container, false)
    const ctx = canvas.getContext('2d')
    const N = 200
    let u = new Float32Array(N).fill(1), v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N), v2 = new Float32Array(N)
    const m = Math.floor(N/2)
    for (let i=m-6;i<=m+6;i++){u[i]=0;v[i]=1}
    const p = {f:0.055,k:0.062,Du:0.2097,Dv:0.105,dt:1.0}
    let t=0, animId
    function step() {
      for(let i=0;i<N;i++){
        const ul=u[(i-1+N)%N],ur=u[(i+1)%N],vl=v[(i-1+N)%N],vr=v[(i+1)%N]
        const lapU=ul-2*u[i]+ur,lapV=vl-2*v[i]+vr,uvv=u[i]*v[i]*v[i]
        u2[i]=Math.max(0,Math.min(1,u[i]+p.dt*(p.Du*lapU-uvv+p.f*(1-u[i]))))
        v2[i]=Math.max(0,Math.min(1,v[i]+p.dt*(p.Dv*lapV+uvv-(p.f+p.k)*v[i])))
      }
      ;[u,u2]=[u2,u];[v,v2]=[v2,v];t++
    }
    function draw() {
      const W=canvas.width,H=canvas.height
      ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H)
      const pad=24,ph=H-pad*2-20
      const drawLine=(arr,col)=>{
        ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath()
        for(let i=0;i<N;i++){
          const x=pad+(i/(N-1))*(W-pad*2),y=pad+ph-arr[i]*ph
          i?ctx.lineTo(x,y):ctx.moveTo(x,y)
        }
        ctx.stroke()
      }
      drawLine(u,'#000');drawLine(v,'#888')
      ctx.strokeStyle='#ddd';ctx.lineWidth=0.5;ctx.beginPath()
      ctx.moveTo(pad,pad+ph);ctx.lineTo(W-pad,pad+ph);ctx.stroke()
      ctx.fillStyle='#666';ctx.font='9pt SF Mono,monospace'
      ctx.fillText(`t=${t}  U (black)  V (gray)  f=${p.f}  k=${p.k}`,pad,H-6)
    }
    function animate(){animId=requestAnimationFrame(animate);for(let i=0;i<6;i++)step();draw()}
    animate()
    return ()=>{cancelAnimationFrame(animId);disconnect();container.innerHTML=''}
  }
}
