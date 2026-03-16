import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Preset: Mitosis (f=0.028, k=0.053)`,chapter:5,math:`<div class="math-section"><h3>Mitosis Pattern</h3>
<p>f=0.028, k=0.053: Self-replicating spots that divide like biological cells.
A spot grows elongated, then pinches off into two daughter spots.</p></div>`,code:`<div class="code-section"><h3>Step 52 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.mitosis},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};