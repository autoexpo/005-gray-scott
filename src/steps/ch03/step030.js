/**
 * Step 30: CPU Performance: Why We Need the GPU
 */


export default {
  title: 'CPU Performance: Why We Need the GPU',
  chapter: 3,

  math: `<div class="math-section"><h3>CPU Performance</h3>
<p>2D CPU simulation at 256×256: ~5ms/step in JS. At 8 steps/frame: ~40ms → 25fps.
At 512×512: ~20ms/step → 160ms → 6fps. GPU achieves 60fps at 512×512.</p></div>`,

  code: `<div class="code-section"><h3>Step 30 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 30: CPU Performance: Why We Need the GPU</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
