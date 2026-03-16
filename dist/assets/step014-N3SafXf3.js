import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";import{t as a}from"./simControls-D-DGtL0_.js";var o={title:`1D Visualization: Line Chart`,chapter:2,math:`<div class="math-section"><h3>1D Visualization</h3>
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
</code></pre></div>`,init(o){let s={top:20,right:20,bottom:60,left:50},c=512-s.left-s.right,l=512-s.top-s.bottom,u=r(o).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${s.left},${s.top})`),d=e().domain([0,1]).range([0,c]),f=e().domain([0,1]).range([l,0]);u.append(`g`).attr(`transform`,`translate(0,${l})`).call(n(d).ticks(5)),u.append(`g`).call(t(f).ticks(5)),u.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),u.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`);let p=u.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),m=u.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#888`).attr(`stroke-width`,1.5),h=u.append(`text`).attr(`x`,0).attr(`y`,l+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),g=new Float32Array(200).fill(1),_=new Float32Array(200).fill(0),v=new Float32Array(200),y=new Float32Array(200);for(let e=94;e<=106;e++)g[e]=0,_[e]=1;let b={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},x=0,S,C=!1;function w(){g.fill(1),_.fill(0);for(let e=94;e<=106;e++)g[e]=0,_[e]=1;x=0}let T=a(o,{onPause:e=>{C=e},onReplay:()=>{w()}});function E(){for(let e=0;e<200;e++){let t=g[(e-1+200)%200],n=g[(e+1)%200],r=_[(e-1+200)%200],i=_[(e+1)%200],a=t-2*g[e]+n,o=r-2*_[e]+i,s=g[e]*_[e]*_[e];v[e]=Math.max(0,Math.min(1,g[e]+b.dt*(b.Du*a-s+b.f*(1-g[e])))),y[e]=Math.max(0,Math.min(1,_[e]+b.dt*(b.Dv*o+s-(b.f+b.k)*_[e])))}[g,v]=[v,g],[_,y]=[y,_],x++}function D(){let e=Array.from(g).map((e,t)=>[t/199,e]),t=Array.from(_).map((e,t)=>[t/199,e]);p.attr(`d`,i().x(e=>d(e[0])).y(e=>f(e[1]))(e)),m.attr(`d`,i().x(e=>d(e[0])).y(e=>f(e[1]))(t)),h.text(`t=${x}  U (black)  V (gray)  f=${b.f}  k=${b.k}`)}function O(){if(S=requestAnimationFrame(O),!C)for(let e=0;e<6;e++)E();D()}return O(),()=>{cancelAnimationFrame(S),T.remove(),r(o).select(`#d3-sim`).remove()}}};export{o as default};