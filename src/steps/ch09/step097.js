/**
 * Step 97: Vite Production Build: Asset Hashing
 */


export default {
  title: 'Vite Production Build: Asset Hashing',
  chapter: 9,

  math: `<div class="math-section"><h3>Vite Production Build</h3>
<p>vite build produces: index.html + hashed JS bundle + hashed CSS.
Asset hashing ensures CDN caches are invalidated on updates.
Total bundle: ~150KB gzipped (Three.js dominates).</p></div>`,

  code: `<div class="code-section"><h3>Step 97 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 97: Vite Production Build: Asset Hashing</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
