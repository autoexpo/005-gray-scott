import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Performance Audit: Lighthouse + WebGL`,chapter:9,math:`<div class="math-section"><h3>Performance Audit</h3>
<p>Lighthouse performance audit targets: FCP &lt;1s, TTI &lt;2s, CLS=0.
WebGL diagnostic: check renderer.info.memory for texture/geometry counts.
Set gl.getError() checks during development to catch GL errors early.</p></div>`,code:`<div class="code-section"><h3>Step 99 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};