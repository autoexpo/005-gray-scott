var e={title:`The Ping-Pong Pattern`,chapter:4,math:`<div class="math-section"><h3>Ping-Pong Pattern</h3>
<p>GPU shaders cannot read and write the same texture simultaneously.
Ping-pong uses two textures alternating as input/output each frame.</p>
<pre style="border:none;background:none;line-height:1.8">
  Frame N: read A → write B
  Frame N+1: read B → write A
  Frame N+2: read A → write B
  ...
</pre></div>`,code:`<div class="code-section"><h3>Step 34 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 34: The Ping-Pong Pattern</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};