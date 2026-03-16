import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Spatially Varying f and k: Parameter Maps`,chapter:8,math:`<div class="math-section"><h3>Spatially Varying Parameters</h3>
<p>Store f(x,y) and k(x,y) as textures. The simulation shader samples these textures
alongside the state texture, allowing gradients and boundaries in parameter space.</p></div>`,code:`<div class="code-section"><h3>Step 83 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};