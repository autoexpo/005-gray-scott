import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`1D Visualization: Line Chart`,chapter:2,math:`<div class="math-section"><h3>1D Visualization</h3>
<p>For 1D simulations, a line chart plots concentration vs. position.
U (food) and V (activator) are plotted simultaneously.</p>
<p>Note: the Gray-Scott model is <em>not</em> biologically realistic in 1D.
Interesting patterns (spots, stripes) require 2D. In 1D we see traveling waves and pulses.</p>
</div>`,code:`<div class="code-section"><h3>Canvas 2D Rendering</h3>
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
</code></pre></div>`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=new Float32Array(200).fill(1),o=new Float32Array(200).fill(0),s=new Float32Array(200),c=new Float32Array(200);for(let e=94;e<=106;e++)a[e]=0,o[e]=1;let l={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},u=0,d;function f(){for(let e=0;e<200;e++){let t=a[(e-1+200)%200],n=a[(e+1)%200],r=o[(e-1+200)%200],i=o[(e+1)%200],u=t-2*a[e]+n,d=r-2*o[e]+i,f=a[e]*o[e]*o[e];s[e]=Math.max(0,Math.min(1,a[e]+l.dt*(l.Du*u-f+l.f*(1-a[e])))),c[e]=Math.max(0,Math.min(1,o[e]+l.dt*(l.Dv*d+f-(l.f+l.k)*o[e])))}[a,s]=[s,a],[o,c]=[c,o],u++}function p(){let e=n.width,t=n.height;i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=t-48-20,s=(t,n)=>{i.strokeStyle=n,i.lineWidth=1.5,i.beginPath();for(let n=0;n<200;n++){let a=24+n/199*(e-48),o=24+r-t[n]*r;n?i.lineTo(a,o):i.moveTo(a,o)}i.stroke()};s(a,`#000`),s(o,`#888`),i.strokeStyle=`#ddd`,i.lineWidth=.5,i.beginPath(),i.moveTo(24,24+r),i.lineTo(e-24,24+r),i.stroke(),i.fillStyle=`#666`,i.font=`9pt SF Mono,monospace`,i.fillText(`t=${u}  U (black)  V (gray)  f=${l.f}  k=${l.k}`,24,t-6)}function m(){d=requestAnimationFrame(m);for(let e=0;e<6;e++)f();p()}return m(),()=>{cancelAnimationFrame(d),r(),t.innerHTML=``}}};export{t as default};