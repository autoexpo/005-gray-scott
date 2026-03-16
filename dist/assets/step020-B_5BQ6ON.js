var e={title:`2D Index Arithmetic`,chapter:3,math:`<div class="math-section"><h3>2D Index with Periodic Wrap</h3>
<div class="math-block">$$\\text{idx}(r,c) = \\bigl((r \\bmod H) + H\\bigr)\\bmod H \\times W + \\bigl((c \\bmod W) + W\\bigr)\\bmod W$$</div>
<p>The double-modulo pattern handles negative indices correctly in JavaScript.</p></div>`,code:`<div class="code-section"><h3>Step 20 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 20: 2D Index Arithmetic</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};