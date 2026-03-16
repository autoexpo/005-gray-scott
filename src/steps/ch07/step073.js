/**
 * Step 73: RK4 Integration: Four-Stage Derivation
 */


export default {
  title: 'RK4 Integration: Four-Stage Derivation',
  chapter: 7,

  math: `<div class="math-section"><h3>Runge-Kutta 4th Order</h3>
<div class="math-block">$$k_1 = F(u), \quad k_2 = F\!\left(u + \frac{\Delta t}{2}k_1\right)$$</div>
<div class="math-block">$$k_3 = F\!\left(u + \frac{\Delta t}{2}k_2\right), \quad k_4 = F(u + \Delta t \cdot k_3)$$</div>
<div class="math-block">$$u^{t+1} = u^t + \frac{\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$</div>
<p>Fourth-order accuracy: error $O(dt^4)$. Allows larger dt than Euler.</p></div>`,

  code: `<div class="code-section"><h3>Step 73 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,

  init(container, state) {
    // RK4 for 1D Gray-Scott
    function rk4Step1D(u, v, N, p) {
      const { f, k, Du, Dv, dt } = p
      const gs = (ui, vi, lapU, lapV) => [
        Du*lapU - ui*vi*vi + f*(1-ui),  // du/dt
        Dv*lapV + ui*vi*vi - (f+k)*vi   // dv/dt
      ]
      // ... (4 stages, each requiring a full Laplacian pass)
      // GPU implementation: 4 ping-pong passes per frame
      // See step074.js for GPU RK4
    }

    const div = document.createElement('div')
    div.style.cssText = 'padding:24px 28px; font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7; overflow-y:auto; height:100%; color:#111; background:#fff'
    div.innerHTML = `
  <div style="font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7;">
    <div style="text-align:center; font-weight:bold; margin-bottom:20px;">
      RK4 INTEGRATION — FOUR STAGES
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="margin-bottom:15px;">
      <strong>Classic 4th-order Runge-Kutta:</strong>
    </div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      k1 = f(t,       y)<br>
      k2 = f(t + h/2, y + h/2 · k1)<br>
      k3 = f(t + h/2, y + h/2 · k2)<br>
      k4 = f(t + h,   y + h   · k3)
    </div>

    <div style="margin-left:15px; margin-bottom:20px; font-family:monospace;">
      y(t+h) = y + h/6 · (k1 + 2k2 + 2k3 + k4)
    </div>

    <div style="margin-bottom:10px;">
      <strong>For Gray-Scott (y = [u,v]):</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      f([u,v]) = [Du·∇²u - u·v² + f·(1-u),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dv·∇²v + u·v² - (f+k)·v]
    </div>

    <div style="margin-bottom:15px;">
      <strong>Stage 1:</strong> evaluate at current state<br>
      <strong>Stage 2:</strong> half-step using k1 estimate<br>
      <strong>Stage 3:</strong> half-step using k2 estimate<br>
      <strong>Stage 4:</strong> full step using k3 estimate
    </div>

    <div style="margin-bottom:15px;">
      <strong>Error:</strong>  Euler O(h²),  RK4 O(h⁵)<br>
      <strong>Cost:</strong>   Euler 1 eval, RK4 4 evals
    </div>

    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div>
      For Gray-Scott: Euler at dt=1.0 is<br>
      sufficient. RK4 only needed at dt>2.
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
