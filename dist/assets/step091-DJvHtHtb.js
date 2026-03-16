import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CQSuB9r_.js";var n={title:`WebGL Performance Best Practices`,chapter:9,math:`<div class="math-section"><h3>WebGL Performance</h3>
<p>Key optimizations: minimize GL state changes, reuse buffers, avoid unnecessary uploads.
Pre-allocate all textures. Use requestAnimationFrame, not setInterval.
Profile with chrome://tracing.</p></div>`,code:`<div class="code-section"><h3>Step 91 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.worms},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};