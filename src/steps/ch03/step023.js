/**
 * Step 23: Initial Conditions for 2D
 */


export default {
  title: 'Initial Conditions for 2D',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Initial Conditions</h3>
<p>Standard: U=1 everywhere, V=0 everywhere, with a small central square of V=1, U=0.
The square size controls how many "seeds" develop.</p></div>`,

  code: `<div class="code-section"><h3>Step 23 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 23: Initial Conditions for 2D</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
