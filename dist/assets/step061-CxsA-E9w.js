import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CQSuB9r_.js";var n={title:`False Color LUT (B&W Gradient)`,chapter:6,math:`<div class="math-section"><h3>False Color</h3>
<p>Map u through a lookup table (LUT). A simple B&W gradient: low u → black, high u → white, with a non-linear mapping to enhance contrast in the pattern region.</p></div>`,code:`<div class="code-section"><h3>Step 61 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.stripes},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};