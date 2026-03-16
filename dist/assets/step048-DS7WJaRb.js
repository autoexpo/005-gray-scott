import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CQSuB9r_.js";var n={title:`Preset System: Named Configurations`,chapter:5,math:`<div class="math-section"><h3>Preset Loading</h3>
<p>A preset resets f, k, Du, Dv to known-good values and optionally resets the simulation grid.
Resetting the grid is needed when moving to a very different parameter regime.</p></div>`,code:`<div class="code-section"><h3>Step 48 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};