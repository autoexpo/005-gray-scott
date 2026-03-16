import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Preset: Worms (f=0.078, k=0.061)`,chapter:5,math:`<div class="math-section"><h3>Worms Pattern</h3>
<p>f=0.078, k=0.061: Long, worm-like domains that fill space. Intermediate between stripes and bubbles.
These patterns are highly dynamic and reorganize over time.</p></div>`,code:`<div class="code-section"><h3>Step 51 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.worms},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};