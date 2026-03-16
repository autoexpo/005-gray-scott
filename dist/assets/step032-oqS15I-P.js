var e={title:`Framebuffer Objects (FBOs)`,chapter:4,math:`<div class="math-section"><h3>Framebuffer Objects</h3>
<p>An FBO is a render target — instead of drawing to the screen, we draw into a texture.
That texture can then be read as input on the next pass.</p></div>`,code:`<div class="code-section"><h3>Step 32 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 32: Framebuffer Objects (FBOs)</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};