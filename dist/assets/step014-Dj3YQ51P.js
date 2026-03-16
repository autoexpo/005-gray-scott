import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";var a={title:`1D Visualization: Line Chart`,chapter:2,math:`<div class="math-section"><h3>1D Visualization</h3>
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
</code></pre></div>`,init(a){let o={top:20,right:20,bottom:60,left:50},s=512-o.left-o.right,c=512-o.top-o.bottom,l=r(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=e().domain([0,1]).range([0,s]),d=e().domain([0,1]).range([c,0]);l.append(`g`).attr(`transform`,`translate(0,${c})`).call(n(u).ticks(5)),l.append(`g`).call(t(d).ticks(5)),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`);let f=l.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),p=l.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#888`).attr(`stroke-width`,1.5),m=l.append(`text`).attr(`x`,0).attr(`y`,c+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),h=new Float32Array(200).fill(1),g=new Float32Array(200).fill(0),_=new Float32Array(200),v=new Float32Array(200);for(let e=94;e<=106;e++)h[e]=0,g[e]=1;let y={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},b=0,x;function S(){for(let e=0;e<200;e++){let t=h[(e-1+200)%200],n=h[(e+1)%200],r=g[(e-1+200)%200],i=g[(e+1)%200],a=t-2*h[e]+n,o=r-2*g[e]+i,s=h[e]*g[e]*g[e];_[e]=Math.max(0,Math.min(1,h[e]+y.dt*(y.Du*a-s+y.f*(1-h[e])))),v[e]=Math.max(0,Math.min(1,g[e]+y.dt*(y.Dv*o+s-(y.f+y.k)*g[e])))}[h,_]=[_,h],[g,v]=[v,g],b++}function C(){let e=Array.from(h).map((e,t)=>[t/199,e]),t=Array.from(g).map((e,t)=>[t/199,e]);f.attr(`d`,i().x(e=>u(e[0])).y(e=>d(e[1]))(e)),p.attr(`d`,i().x(e=>u(e[0])).y(e=>d(e[1]))(t)),m.text(`t=${b}  U (black)  V (gray)  f=${y.f}  k=${y.k}`)}function w(){x=requestAnimationFrame(w);for(let e=0;e<6;e++)S();C()}return w(),()=>{cancelAnimationFrame(x),r(a).select(`#d3-sim`).remove()}}};export{a as default};