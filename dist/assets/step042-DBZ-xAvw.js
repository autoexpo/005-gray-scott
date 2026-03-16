import{t as e}from"./parameters-Lm_51_Zf.js";import{t}from"./gpuLoop-BZAGlODu.js";var n={title:`Integrating GPU Pipeline with Three.js`,chapter:4,math:`<div class="math-section"><h3>Three.js Integration</h3>
<p>Three.js WebGLRenderTarget wraps an FBO. We use RawShaderMaterial to write
pure GLSL without Three.js shader chunks. The renderer handles context management.</p></div>`,code:`<div class="code-section"><h3>Step 42 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(n,r){return t(n,{params:{...e.spots},size:256,stepsPerFrame:8,vizMode:`invert`})}};export{n as default};