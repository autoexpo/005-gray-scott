import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`5-Point vs 9-Point Laplacian Comparison`,chapter:3,math:`<div class="math-section"><h3>Stencil Comparison</h3>
<p>5-point stencil produces slightly diamond-shaped spots at low resolution.
9-point produces circular spots. The difference is visible at 64×64 but negligible at 256+.</p></div>`,code:`<div class="code-section"><h3>Step 28 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};