var e={title:`Running the 2D CPU Simulation`,chapter:3,math:`<div class="math-section"><h3>2D CPU Step</h3>
<p>The 2D step is O(N²) per step, making it O(N²·T) total for T steps.
For N=256: 65,536 cells × 1000 steps = 65M operations — feasible on CPU but slow.</p></div>`,code:`<div class="code-section"><h3>Step 24 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 24: Running the 2D CPU Simulation</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};