import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Responsive Layout: Resize and DPR`,chapter:9,math:`<div class="math-section"><h3>Responsive Canvas</h3>
<p>On resize: update renderer.setSize(), update uniforms, preserve simulation state.
DPR (device pixel ratio) affects visual quality — high-DPR screens may need
a reduced simulation resolution to maintain 60fps.</p></div>`,code:`<div class="code-section"><h3>Step 94 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};