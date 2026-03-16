/**
 * Step 19: Extending to 2D: Row-Major Layout
 */


export default {
  title: 'Extending to 2D: Row-Major Layout',
  chapter: 3,

  math: `<div class="math-section"><h3>2D Grid Layout</h3>
<p>A 2D W×H grid is stored as a flat 1D array of length W×H.</p>
<div class="math-block">$$\text{index}(r, c) = r \times W + c$$</div>
<p>This row-major layout is cache-friendly for row-by-row access patterns.</p></div>`,

  code: `<div class="code-section"><h3>Step 19 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 19: Extending to 2D: Row-Major Layout</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
