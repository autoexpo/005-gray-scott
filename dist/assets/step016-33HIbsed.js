var e={title:`Effect of Changing f in 1D`,chapter:2,math:`<div class="math-section"><h3>Effect of Feed Rate f</h3>
<p>Increasing f speeds up U replenishment. Effect on patterns:</p>
<ul style="margin-left:16px;line-height:1.9">
<li>f too small → V starves, patterns die</li>
<li>f optimal → stable traveling pulses or standing waves</li>
<li>f too large → V grows unchecked, uniform coverage</li>
</ul></div>`,code:`<div class="code-section"><h3>Step 16 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 16: Effect of Changing f in 1D</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};