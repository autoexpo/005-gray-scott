import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Euler vs RK4: Accuracy Comparison`,chapter:7,math:`<div class="math-section"><h3>Euler vs RK4 Comparison</h3>
<p>At the same dt, RK4 is more accurate. At equal compute cost (RK4 uses 4× longer dt),
accuracy is similar but RK4 allows coarser time resolution for the same quality.</p></div>`,code:`<div class="code-section"><h3>Step 75 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};