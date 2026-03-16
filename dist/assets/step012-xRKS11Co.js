import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";import{t as a}from"./simControls-D-DGtL0_.js";var o={title:`1D Euler Integration Step`,chapter:2,math:`
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
`,code:`
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
`,init(o){let s={top:20,right:20,bottom:60,left:50},c=512-s.left-s.right,l=512-s.top-s.bottom,u=r(o).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${s.left},${s.top})`),d=e().domain([0,1]).range([0,c]),f=e().domain([0,1]).range([l,0]);u.append(`g`).attr(`transform`,`translate(0,${l})`).call(n(d).ticks(5)),u.append(`g`).call(t(f).ticks(5)),u.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),u.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`);let p=u.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),m=u.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#999`).attr(`stroke-width`,1),h=u.append(`text`).attr(`x`,0).attr(`y`,l+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),g=new Float32Array(200).fill(1),_=new Float32Array(200).fill(0),v=new Float32Array(200),y=new Float32Array(200);for(let e=94;e<=106;e++)g[e]=0,_[e]=1;let b={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},x=0,S,C=!1;function w(){g.fill(1),_.fill(0);for(let e=94;e<=106;e++)g[e]=0,_[e]=1;x=0}let T=a(o,{onPause:e=>{C=e},onReplay:()=>{w()}});function E(){for(let e=0;e<200;e++){let t=g[(e-1+200)%200],n=g[(e+1)%200],r=_[(e-1+200)%200],i=_[(e+1)%200],a=t-2*g[e]+n,o=r-2*_[e]+i,s=g[e]*_[e]*_[e];v[e]=Math.max(0,Math.min(1,g[e]+b.dt*(b.Du*a-s+b.f*(1-g[e])))),y[e]=Math.max(0,Math.min(1,_[e]+b.dt*(b.Dv*o+s-(b.f+b.k)*_[e])))}[g,v]=[v,g],[_,y]=[y,_],x++}function D(){let e=Array.from(g).map((e,t)=>[t/199,e]),t=Array.from(_).map((e,t)=>[t/199,e]);p.attr(`d`,i().x(e=>d(e[0])).y(e=>f(e[1]))(e)),m.attr(`d`,i().x(e=>d(e[0])).y(e=>f(e[1]))(t)),h.text(`t=${x}  U (black)  V (gray)`)}function O(){if(S=requestAnimationFrame(O),!C)for(let e=0;e<4;e++)E();D()}return O(),()=>{cancelAnimationFrame(S),T.remove(),r(o).select(`#d3-sim`).remove()}}};export{o as default};