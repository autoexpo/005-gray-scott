import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Spatial Resolution: 128 vs 512 vs 1024`,chapter:7,math:`<div class="math-section"><h3>Spatial Resolution</h3>
<p>Higher resolution reveals finer pattern detail but costs O(N²) per step.
The pattern wavelength is independent of resolution (determined by parameters),
but finer structures require finer grids to resolve correctly.</p></div>`,code:`<div class="code-section"><h3>Step 77 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};