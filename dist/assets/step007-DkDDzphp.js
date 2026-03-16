import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Parameters: f, k, Du, Dv`,chapter:1,math:`
<div class="math-section">
  <h3>The Four Parameters</h3>
  <p>The Gray-Scott model has four key parameters:</p>
</div>

<div class="math-section">
  <h3>Feed Rate — f</h3>
  <div class="math-block">$$f \\in [0.01, 0.12]$$</div>
  <p>Controls how quickly U is replenished from the environment.
  The feed term $f(1-U)$ drives U toward 1 at rate f.</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>f too low → V starves, patterns die out</li>
    <li>f too high → U is always plentiful, V grows everywhere (no contrast)</li>
    <li>f in sweet spot → stable localized patterns</li>
  </ul>
</div>

<div class="math-section">
  <h3>Kill Rate — k</h3>
  <div class="math-block">$$k \\in [0.04, 0.07]$$</div>
  <p>Controls how quickly V is removed. The kill term $(f+k)V$ combines
  the background removal (f) with additional decay (k).</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li>k too low → V persists everywhere (uniform fill)</li>
    <li>k too high → V dies before patterns form</li>
  </ul>
</div>

<div class="math-section">
  <h3>Diffusion Rates — Du, Dv</h3>
  <div class="math-block">$$D_U = 0.2097 \\approx 2 \\times D_V, \\quad D_V = 0.105$$</div>
  <p>The critical condition for Turing instability requires Du > Dv.
  The ratio Du/Dv ≈ 2 is standard for Gray-Scott.</p>
  <p>Varying the ratio changes pattern scale and character but the
  (f,k) diagram remains the primary control surface.</p>
</div>

<div class="math-section">
  <h3>Parameter Sensitivity</h3>
  <p>The pattern phase diagram is extremely sensitive — a change of 0.001 in f
  or k can completely change the pattern type. This makes the parameter space
  rich and the model fascinating to explore.</p>
</div>
`,code:`
<div class="code-section">
  <h3>Parameter Object and lil-gui Binding</h3>
<pre><code class="language-js">import GUI from 'lil-gui'

const params = {
  f:  0.055,   // feed rate
  k:  0.062,   // kill rate
  Du: 0.2097,  // U diffusion
  Dv: 0.105,   // V diffusion
  dt: 1.0,     // time step
}

const gui = new GUI()
const folder = gui.addFolder('Gray-Scott')

// Each control writes directly to params object.
// The GPU shader reads params each frame via uniforms.
folder.add(params, 'f', 0.010, 0.120, 0.001)
folder.add(params, 'k', 0.040, 0.080, 0.001)
folder.add(params, 'Du', 0.05, 0.50, 0.001)
folder.add(params, 'Dv', 0.01, 0.30, 0.001)
folder.add(params, 'dt', 0.1, 2.0, 0.05)
folder.open()

// In the render loop:
function animate() {
  sim.step(params, stepsPerFrame) // uniforms updated here
  sim.render('invert')
  requestAnimationFrame(animate)
}
</code></pre>
</div>

<div class="code-section">
  <h3>Uniform Hot-Swap in GLSL</h3>
<pre><code class="language-glsl">// The GLSL shader doesn't need recompilation
// when parameters change — they're uniforms:

uniform float uF;   // feed rate
uniform float uK;   // kill rate
uniform float uDu;  // U diffusion coefficient
uniform float uDv;  // V diffusion coefficient
uniform float uDt;  // time step size

// SimShader.update() calls:
material.uniforms.uF.value = params.f
material.uniforms.uK.value = params.k
// → GPU reads new values on next render call
</code></pre>
</div>
`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`,showGui:!0})}};export{n as default};