import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CQSuB9r_.js";var n={title:`Anisotropic Diffusion Tensor`,chapter:8,math:`<div class="math-section"><h3>Anisotropic Diffusion</h3>
<p>Replace the scalar Du, Dv with 2×2 diffusion tensors D:
$$
abla cdot (D 
abla u)$$
This allows directional diffusion — patterns oriented along a preferred axis.</p></div>`,code:`<div class="code-section"><h3>Step 81 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};