import{t as e}from"./linear-BCfk2I7B.js";import{n as t,t as n}from"./axis-DtUEpaBV.js";import{o as r}from"./src-51qo7f6l.js";import{t as i}from"./line-XuMgxOSY.js";var a={title:`1D Euler Integration Step`,chapter:2,math:`
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
`,init(a){let o={top:20,right:20,bottom:60,left:50},s=512-o.left-o.right,c=512-o.top-o.bottom,l=r(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=e().domain([0,1]).range([0,s]),d=e().domain([0,1]).range([c,0]);l.append(`g`).attr(`transform`,`translate(0,${c})`).call(n(u).ticks(5)),l.append(`g`).call(t(d).ticks(5)),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`);let f=l.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#000`).attr(`stroke-width`,1.5),p=l.append(`path`).attr(`fill`,`none`).attr(`stroke`,`#999`).attr(`stroke-width`,1),m=l.append(`text`).attr(`x`,0).attr(`y`,c+50).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`fill`,`#666`),h=new Float32Array(200).fill(1),g=new Float32Array(200).fill(0),_=new Float32Array(200),v=new Float32Array(200);for(let e=94;e<=106;e++)h[e]=0,g[e]=1;let y={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},b=0,x;function S(){for(let e=0;e<200;e++){let t=h[(e-1+200)%200],n=h[(e+1)%200],r=g[(e-1+200)%200],i=g[(e+1)%200],a=t-2*h[e]+n,o=r-2*g[e]+i,s=h[e]*g[e]*g[e];_[e]=Math.max(0,Math.min(1,h[e]+y.dt*(y.Du*a-s+y.f*(1-h[e])))),v[e]=Math.max(0,Math.min(1,g[e]+y.dt*(y.Dv*o+s-(y.f+y.k)*g[e])))}[h,_]=[_,h],[g,v]=[v,g],b++}function C(){let e=Array.from(h).map((e,t)=>[t/199,e]),t=Array.from(g).map((e,t)=>[t/199,e]);f.attr(`d`,i().x(e=>u(e[0])).y(e=>d(e[1]))(e)),p.attr(`d`,i().x(e=>u(e[0])).y(e=>d(e[1]))(t)),m.text(`t=${b}  U (black)  V (gray)`)}function w(){x=requestAnimationFrame(w);for(let e=0;e<4;e++)S();C()}return w(),()=>{cancelAnimationFrame(x),r(a).select(`#d3-sim`).remove()}}};export{a as default};