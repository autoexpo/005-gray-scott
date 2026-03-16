var e={title:`RK4 Integration: Four-Stage Derivation`,chapter:7,math:`<div class="math-section"><h3>Runge-Kutta 4th Order</h3>
<div class="math-block">$$k_1 = F(u), quad k_2 = F!left(u + \frac{Delta t}{2}k_1\right)$$</div>
<div class="math-block">$$k_3 = F!left(u + \frac{Delta t}{2}k_2\right), quad k_4 = F(u + Delta t cdot k_3)$$</div>
<div class="math-block">$$u^{t+1} = u^t + \frac{Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$</div>
<p>Fourth-order accuracy: error $O(dt^4)$. Allows larger dt than Euler.</p></div>`,code:`<div class="code-section"><h3>Step 73 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,init(e,t){let n=document.createElement(`div`);return n.style.cssText=`padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%`,n.innerHTML=`<pre style="border:none;background:none">Step 73: RK4 Integration: Four-Stage Derivation</pre>`,e.appendChild(n),()=>{e.innerHTML=``}}};export{e as default};