/**
 * Step 93: Web Worker CPU Fallback
 */


export default {
  title: 'Web Worker CPU Fallback',
  chapter: 9,

  math: `<div class="math-section"><h3>Web Workers</h3>
<p>Web Workers run JavaScript in a separate thread, keeping the main thread free
for UI. The CPU simulation runs in a Worker; results are transfered via SharedArrayBuffer.</p></div>`,

  code: `<div class="code-section"><h3>Step 93 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 93: Web Worker CPU Fallback</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
