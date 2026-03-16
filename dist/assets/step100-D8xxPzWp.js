import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Final Synthesis: Full Gray-Scott System`,chapter:9,math:`<div class="math-section"><h3>Final Synthesis</h3>
<p>You now understand the complete Gray-Scott system — from the PDE derivation,
through numerical discretization, GPU acceleration, visualization, and deployment.
The simulation in the right column is the fully-featured implementation:
all parameters controllable, mouse seeding active, Stats.js monitoring performance.</p>
<p>Explore the parameter space. Every (f,k) pair in the pattern-forming region
produces a unique, beautiful structure. None of it is programmed — it all
emerges from two simple equations.</p></div>`,code:`<div class="code-section"><h3>Step 100 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.coral},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};