import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CQSuB9r_.js";var n={title:`Temporal Blending: Motion Blur`,chapter:6,math:`<div class="math-section"><h3>Motion Blur</h3>
<p>Blend the current frame with an accumulation buffer: out = 0.95 × prev + 0.05 × current.
Moving fronts leave a trail; stationary patterns remain sharp.</p></div>`,code:`<div class="code-section"><h3>Step 64 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.coral},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};