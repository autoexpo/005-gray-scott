import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Preset: Stripes (f=0.060, k=0.062)`,chapter:5,math:`<div class="math-section"><h3>Stripes Pattern</h3>
<p>f=0.060, k=0.062: Produces labyrinthine stripe patterns. Similar to zebra stripes or coral brain patterns.
The stripes form with a characteristic wavelength determined by Du/Dv.</p></div>`,code:`<div class="code-section"><h3>Step 50 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.stripes},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};