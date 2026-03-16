import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-CBnP2B9w.js";var n={title:`Mouse Interaction: Drawing V`,chapter:5,math:`<div class="math-section"><h3>Mouse-Based Seeding</h3>
<p>Drawing V into the simulation by clicking/dragging injects activator locally.
Existing patterns are perturbed; new patterns nucleate from the drawn region.</p></div>`,code:`<div class="code-section"><h3>Step 57 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};