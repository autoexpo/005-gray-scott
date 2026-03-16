var e={title:`The 5-Point Laplacian Stencil in 2D`,chapter:3,math:`<div class="math-section"><h3>2D 5-Point Stencil</h3>
<div class="math-block">$$\\nabla^2 u_{i,j} = u_{i-1,j} + u_{i+1,j} + u_{i,j-1} + u_{i,j+1} - 4u_{i,j}$$</div>
<pre style="border:none;background:none;text-align:center;line-height:1.8">
       +1
  +1   −4   +1
       +1
</pre></div>`,code:`<div class="code-section"><h3>Step 21 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 21: The 5-Point Laplacian Stencil in 2D</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};