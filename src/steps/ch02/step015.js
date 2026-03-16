/**
 * Step 15: 1D Traveling Waves and Standing Patterns
 */


export default {
  title: '1D Traveling Waves and Standing Patterns',
  chapter: 2,

  math: `<div class="math-section"><h3>1D Patterns</h3><p>In 1D, Gray-Scott produces traveling wave pulses and stationary patterns.
The specific dynamics depend on (f,k) and the 1D geometry — no spots or stripes form in 1D,
but the underlying chemistry is identical.</p></div>`,

  code: `<div class="code-section"><h3>Step 15 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 15: 1D Traveling Waves and Standing Patterns</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
