import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Sub-Stepping for Speed`,chapter:9,math:`<div class="math-section"><h3>Sub-Stepping Analysis</h3>
<p>The GPU is often underutilized at 1 step per frame. Sub-stepping runs
N simulation passes before rendering, maximizing GPU utilization.
Monitor with Stats.js — target &lt;16ms per frame total.</p></div>`,code:`<div class="code-section"><h3>Step 92 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.worms},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};