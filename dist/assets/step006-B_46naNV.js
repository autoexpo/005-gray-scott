import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Reaction + Diffusion Combined`,chapter:1,math:`
<div class="math-section">
  <h3>Why Reaction + Diffusion Creates Patterns</h3>
  <p>Neither reaction alone nor diffusion alone creates stable spatial structure:</p>
  <ul style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li><strong>Diffusion alone:</strong> smooths everything → uniform field</li>
    <li><strong>Reaction alone:</strong> same everywhere in space → no spatial variation</li>
    <li><strong>Both together:</strong> diffusion-driven instability → Turing patterns</li>
  </ul>
</div>

<div class="math-section">
  <h3>The Turing Instability Mechanism</h3>
  <p>The key insight: the activator (V) and inhibitor (U) diffuse at <em>different rates</em>.</p>
  <p>When V is perturbed upward in some region:</p>
  <ol style="margin-left:16px; margin-top:6px; line-height:1.9">
    <li>V autocatalyses: local V grows further (positive feedback)</li>
    <li>V consumes U locally: U depletes</li>
    <li>U diffuses in faster than V spreads out (Du > Dv)</li>
    <li>Nearby regions gain U → V can grow there too (spot nucleation)</li>
    <li>V inhibits adjacent regions via depletion → spacing between spots</li>
  </ol>
  <p>Result: a stable periodic pattern with characteristic wavelength.</p>
</div>

<div class="math-section">
  <h3>Combined PDE — Reminder</h3>
  <div class="math-block">$$\\frac{\\partial U}{\\partial t} = \\underbrace{D_U \\nabla^2 U}_{\\text{diffusion}} \\underbrace{- UV^2 + f(1-U)}_{\\text{reaction + feed}}$$</div>
  <div class="math-block">$$\\frac{\\partial V}{\\partial t} = \\underbrace{D_V \\nabla^2 V}_{\\text{diffusion}} \\underbrace{+ UV^2 - (f+k)V}_{\\text{reaction + kill}}$$</div>
  <p>Diffusion couples adjacent cells. Reaction drives local dynamics. Together they create spatial patterns.</p>
</div>

<div class="math-section">
  <h3>What you see in the viz →</h3>
  <p>The visualization shows U concentration (white = high food, dark = activator spots).
  A small square seed of V was placed at center. Watch the pattern spread outward.</p>
</div>
`,code:`
<div class="code-section">
  <h3>The Full GPU Simulation Loop</h3>
  <div class="filename">src/utils/gpuLoop.js (simplified)</div>
<pre><code class="language-js">// Setup: Three.js renderer + GPU ping-pong FBO
const renderer = new THREE.WebGLRenderer()
const sim = new GPUSim(renderer, 256)
sim.reset(params)  // seed center patch

// Each animation frame:
function animate() {
  requestAnimationFrame(animate)

  // Run N simulation steps per frame
  // (sub-stepping for performance)
  sim.step(params, stepsPerFrame)

  // Render result to screen
  sim.render('invert')  // 1-u: dark=food, light=activator
}
animate()
</code></pre>
</div>

<div class="code-section">
  <h3>GPUSim.step() internals</h3>
<pre><code class="language-js">// Each sim step:
// 1. Check for mouse seeding
if (seedShader.isActive) {
  seedShader.render(renderer,
    pingpong.read,   // source
    pingpong.write)  // destination
  pingpong.swap()
}

// 2. Run Gray-Scott compute shader
simShader.render(renderer,
  pingpong.read,   // input state
  pingpong.write)  // output state

// 3. Swap buffers (ping → pong → ping)
pingpong.swap()

// Result: pingpong.read now holds the new state
</code></pre>
</div>
`,init(n,r){return t(n,{params:e.spots,size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};