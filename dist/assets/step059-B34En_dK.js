import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Grayscale Mapping: U to Luminance`,chapter:6,math:`<div class="math-section"><h3>Grayscale Mapping</h3>
<p>The simplest visualization: output = (u, u, u, 1). High food = bright white. Pattern regions where V is high and U is depleted appear dark.</p></div>`,code:`<div class="code-section"><h3>Step 59 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`grayscale`})}};export{n as default};