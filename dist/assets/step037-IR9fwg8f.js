var e={title:`Fragment Shader: Neighbour Sampling`,chapter:4,math:`<div class="math-section"><h3>Sampling Neighbours</h3>
<p>In GLSL, texture2D(sampler, uv + offset) reads the value at a neighbouring texel.
With RepeatWrapping, this automatically handles periodic boundary conditions.</p></div>`,code:`<div class="code-section"><h3>Step 37 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 37: Fragment Shader: Neighbour Sampling</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};