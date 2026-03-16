/**
 * Step 96: Progress Persistence: localStorage
 */


export default {
  title: 'Progress Persistence: localStorage',
  chapter: 9,

  math: `<div class="math-section"><h3>localStorage Persistence</h3>
<p>localStorage.setItem('gs-step', index) persists progress across sessions.
Read on startup to resume where the user left off.
~5KB budget for step index + UI state.</p></div>`,

  code: `<div class="code-section"><h3>Step 96 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 96: Progress Persistence: localStorage</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
