/**
 * Step 17: Effect of Changing Du and Dv in 1D
 */


export default {
  title: 'Effect of Changing Du and Dv in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Diffusion Ratio Du/Dv</h3>
<p>The ratio Du/Dv is critical for Turing instability. Standard: Du=0.2097, Dv=0.105 (ratio 2).</p>
<p>Reducing the ratio reduces pattern contrast; ratio below ~1.5 may prevent patterns.</p></div>`,

  code: `<div class="code-section"><h3>Step 17 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%'
    div.innerHTML = '<pre style="border:none;background:none">Step 17: Effect of Changing Du and Dv in 1D</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
