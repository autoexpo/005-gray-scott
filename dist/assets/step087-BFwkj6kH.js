var e={title:`Turing Instability Analysis: Linearization`,chapter:8,math:`<div class="math-section"><h3>Turing Instability: Linear Analysis</h3>
<p>Linearize around the homogeneous steady state $(u^*, v^*)$. Write $u = u^* + \\tilde{u}\\,e^{iqx+\\sigma t}$.
The growth rate $\\sigma(q)$ determines which wavenumbers $q$ are unstable.
Instability occurs when $\\text{Re}(\\sigma) > 0$ for some $q \\neq 0$.</p></div>`,code:`<div class="code-section"><h3>Step 87 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 87: Turing Instability Analysis: Linearization</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};