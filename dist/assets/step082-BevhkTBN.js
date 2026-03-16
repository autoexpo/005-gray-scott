import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Noise Perturbation: Gaussian Noise on U`,chapter:8,math:`<div class="math-section"><h3>Stochastic Noise</h3>
<p>Adding Gaussian noise to U each step: $U leftarrow U + epsilon cdot mathcal{N}(0,1)$.
Small noise (ε=0.001) breaks symmetry and accelerates pattern formation.
Large noise disrupts existing patterns.</p></div>`,code:`<div class="code-section"><h3>Step 82 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};