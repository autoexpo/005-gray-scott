var e={title:`Stability Analysis: CFL Condition`,chapter:7,math:`<div class="math-section"><h3>CFL Stability Condition</h3>
<p>The Courant-Friedrichs-Lewy condition for the diffusion equation:</p>
<div class="math-block">$$Delta t leq \frac{h^2}{2D_{max}} quad 	ext{(1D)}$$</div>
<div class="math-block">$$Delta t leq \frac{h^2}{4D_{max}} quad 	ext{(2D)}$$</div>
<p>With h=1, Du=0.2097: dt ≤ 2.38 (1D) or dt ≤ 1.19 (2D). Use dt=1.0 for safety.</p></div>`,code:`<div class="code-section"><h3>Step 71 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 71: Stability Analysis: CFL Condition</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};