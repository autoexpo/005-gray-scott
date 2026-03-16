import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Visualization Pass: Screen Output`,chapter:4,math:`<div class="math-section"><h3>Visualization Pass</h3>
<p>After simulation, a second full-screen pass reads the (u,v) texture and
converts it to displayable RGB. This separation allows multiple viz modes.</p></div>`,code:`<div class="code-section"><h3>Step 41 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`grayscale`})}};export{n as default};