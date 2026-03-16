import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-Be70l4tF.js";var n={title:`Preset: Bubbles (f=0.098, k=0.057)`,chapter:5,math:`<div class="math-section"><h3>Bubbles Pattern</h3>
<p>f=0.098, k=0.057: Large bubble-like domains expanding outward.
High feed rate means V is well-supplied and forms macroscopic structures.</p></div>`,code:`<div class="code-section"><h3>Step 53 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.bubbles},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};