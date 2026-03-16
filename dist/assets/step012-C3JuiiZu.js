import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`1D Euler Integration Step`,chapter:2,math:`
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
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=new Float32Array(200).fill(1),o=new Float32Array(200).fill(0),s=new Float32Array(200),c=new Float32Array(200);for(let e=94;e<=106;e++)a[e]=0,o[e]=1;let l={f:.055,k:.062,Du:.2097,Dv:.105,dt:1},u=0,d;function f(){for(let e=0;e<200;e++){let t=a[(e-1+200)%200],n=a[(e+1)%200],r=o[(e-1+200)%200],i=o[(e+1)%200],u=t-2*a[e]+n,d=r-2*o[e]+i,f=a[e]*o[e]*o[e];s[e]=Math.max(0,Math.min(1,a[e]+l.dt*(l.Du*u-f+l.f*(1-a[e])))),c[e]=Math.max(0,Math.min(1,o[e]+l.dt*(l.Dv*d+f-(l.f+l.k)*o[e])))}[a,s]=[s,a],[o,c]=[c,o],u++}function p(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=t-48-20;i.strokeStyle=`#000`,i.lineWidth=1.5,i.beginPath();for(let t=0;t<200;t++){let n=24+t/199*(e-48),o=24+r-a[t]*r;t?i.lineTo(n,o):i.moveTo(n,o)}i.stroke(),i.strokeStyle=`#999`,i.lineWidth=1,i.beginPath();for(let t=0;t<200;t++){let n=24+t/199*(e-48),a=24+r-o[t]*r;t?i.lineTo(n,a):i.moveTo(n,a)}i.stroke(),i.fillStyle=`#666`,i.font=`9pt SF Mono,monospace`,i.fillText(`t=${u}  U (black)  V (gray)`,24,t-6)}function m(){d=requestAnimationFrame(m);for(let e=0;e<4;e++)f();p()}return m(),()=>{cancelAnimationFrame(d),r(),t.innerHTML=``}}};export{t as default};